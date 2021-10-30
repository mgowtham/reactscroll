import { useEffect, useState, useMemo, createContext } from "react";
import ReactSlider from 'react-slider'
import "./styles.css";
import axios from "axios";
import CONFIG from "./config";
import ImgConf from "./components/ImageCtr";
import Gray from "./contexts/Grayscale";
import GrayScale from "./components/GreyScale";
import InfiniteScroll from 'react-infinite-scroll-component';
import Modal from 'react-modal';
const {ImageCtr, ImageView} = ImgConf;


export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
  const [imageCount, setImageCount] = useState(0);
  const [isGray, setGray] = useState(false);
  const [modalConf, setModalConf] = useState(null);
  const [blur, setBlur] = useState(0);
  const [modalGray, setmodalGray] = useState(null);
  // let greyConst = useContext(Gray)
  // const {updateGray } = props;
  // const {isGray, setGray} =  greyConst;
  function updateChecked(val) {
       setGray(val)
  }

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);
  
  let isMobile = (width <= 768);

  let nextImageColl = useMemo(() => {

  })
  
  let noOfImagesToFetch = isMobile ?  CONFIG.fetchRows * CONFIG.mobile.noOfImginRow : CONFIG.fetchRows * CONFIG.deskTop.noOfImginRow
  async function fetchImages(conf) {
    let imageColl = await axios.get("https://picsum.photos/v2/list", {
      params: {
        page: conf.page,
        limit: conf.limit
      }
    });
    let totalImages = [...images, ...imageColl.data]
    setImageCount(totalImages.length);    
    setImages(totalImages);
  }
  useEffect(() => {
    console.log("imageColl");
    let noofInitImages =  isMobile ?  CONFIG.initPageRows * CONFIG.mobile.noOfImginRow : CONFIG.initPageRows * CONFIG.deskTop.noOfImginRow
    
    fetchImages({page: 1, limit: noofInitImages});
  }, []);

  // function get


 
  

 

  // const factorial = useMemo(() => factorialOf(number), [number]);
  // return (
  //   <div className="App">
  //     <ImageCtr images={images} />
  //   </div>
  // );
//   let imgURL = useMemo(() => {
//     return isGray ?  `${image.download_url}/?grayscale` : image.download_url 
// }, [isGray])
  function fetchMoreData() {

    let nextPage = Math.floor(images.length / noOfImagesToFetch ) + 1
    setPage(page + 1)
    fetchImages({page: nextPage, limit: noOfImagesToFetch});
  }

  function closeModal() {
    setModalConf(null)
  }

  function setBlurConf(event) {
    setBlur(event.currentTarget.value)
  }

  function setmodalGrayConf(value) {
      setmodalGray(value)
  }

  return (
    <Gray.Provider value={ {isGray, setGray, setModalConf, modalConf} }>
     
     
      <div>
      {/* <ReactSlider
              className="horizontal-slider"
              marks
              markClassName="example-mark"
              min={0}
              max={9}
              thumbClassName="example-thumb"
              trackClassName="example-track"
              renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          /> */}
      
      
      <Modal
        isOpen={modalConf}
      >
          <ImageView showDownlodLink={true} showDownloader={true} image={modalConf} blur={blur} modalGray={modalGray}/>

          <button class="close-modal" onClick={closeModal}> X </button>
            <label for="quantity">Set blur (between 1 and 10):</label>
            <input onChange={setBlurConf} type="range" id="volume" min="0" max="10" defaultValue="0" step="1"/>
            <GrayScale updateGray={setmodalGrayConf} />

            
          
           
            
      </Modal>
   

        <h1>demo: react-infinite-scroll-component</h1>
        <GrayScale  updateGray={updateChecked} />
        <InfiniteScroll
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
