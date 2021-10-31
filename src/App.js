import { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import CONFIG from "./config";
import ImgConf from "./components/ImageCtr";
import Gray from "./contexts/Grayscale";
import GrayScale from "./components/GreyScale";
import InfiniteScroll from 'react-infinite-scroll-component';
import Modal from 'react-modal';
const {ImageCtr, ImageView} = ImgConf;
import { useBeforeunload } from 'react-beforeunload';



export default function App() {
  let localState = [];
  if (sessionStorage.getItem('reactScroll')) {
    localState = JSON.parse(sessionStorage.getItem('reactScroll'))
  }
  let initialImages = localState.images || []
  let localGrayState = localState.isGray || false
 
  const [images, setImages] = useState(initialImages);
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
  const [isGray, setGray] = useState(localGrayState);
  const [modalConf, setModalConf] = useState(null);
  const [blur, setBlur] = useState(0);
  const [modalGray, setmodalGray] = useState(null);
 
  function updateChecked(val) {
       setGray(val)
  }

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }

  function setLocalState() {
    let userState = {
      scrollTop: window.scrollY,
      images,
      isGray
    }
    sessionStorage.setItem('reactScroll', JSON.stringify(userState))

  }

  let isMobile = (width <= 768);

  
  let noOfImagesToFetch = isMobile ?  CONFIG.fetchRows * CONFIG.mobile.noOfImginRow : CONFIG.fetchRows * CONFIG.deskTop.noOfImginRow
  async function fetchImages(conf) {
    let imageColl = await axios.get("https://picsum.photos/v2/list", {
      params: {
        page: conf.page,
        limit: conf.limit
      }
    });
    let totalImages = [...images, ...imageColl.data]
    setImages(totalImages);
  }
 

  
  function fetchMoreData() {

    let nextPage = Math.floor(images.length / noOfImagesToFetch ) + 1
    setPage(page + 1)
    fetchImages({page: nextPage, limit: noOfImagesToFetch});
  }

  function closeModal() {
    setModalConf(null)
    setmodalGray(null)
  }

  function setBlurConf(event) {
    setBlur(event.currentTarget.value)
  }

  function setmodalGrayConf(value) {
      setmodalGray(value)
  }

  useBeforeunload(() => {
    setLocalState()
    window.removeEventListener('resize', handleWindowSizeChange);
  })

  useEffect(() => {
    let noofInitImages =  isMobile ?  CONFIG.initPageRows * CONFIG.mobile.noOfImginRow : CONFIG.initPageRows * CONFIG.deskTop.noOfImginRow
    window.addEventListener('resize', handleWindowSizeChange);
   
    if (localState.scrollTop) {
      window.scrollTo(0, localState.scrollTop)
     } else {
      fetchImages({page: 1, limit: noofInitImages});
     }
    
  }, []);

  return (
    <Gray.Provider value={ {isGray, setGray, setModalConf, modalConf} }>
     
     
      <div>
      
      <Modal
        isOpen={modalConf}
      >
        <div className='modal-ctr'>
          <ImageView showDownlodLink={true} showDownloader={true} image={modalConf} blur={blur} modalGray={modalGray}/>

          <button class="close-modal" onClick={closeModal}> X </button>
          <label for="quantity">Set blur (between 1 and 10):</label>
          <input onChange={setBlurConf} type="range" id="volume" min="0" max="10" defaultValue="0" step="1"/>
          <GrayScale defaultValue={isGray} updateGray={setmodalGrayConf} />


        </div>
          
            
          
           
            
      </Modal>
   
      <header>
        <h1>demo: react-infinite-scroll-component</h1>
        <GrayScale defaultValue={isGray} updateGray={updateChecked} />
      </header>
          <InfiniteScroll
            style={{top: '150px'}}
              dataLength={images.length}
              next={  fetchMoreData}
              hasMore={true}
              loader={<h4>Loading...</h4>}
            >
              <ImageCtr images={images} />
            </InfiniteScroll>       
 
      </div>
    </Gray.Provider>

  );
}
