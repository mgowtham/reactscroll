import { Fragment, useContext, useMemo, useState } from "react";
import "./ImageCtr.css";
import Gray from "../contexts/Grayscale";

import lib from "../utils/lib";

const { serialize } = lib

function ImageView(props) {
  const { image , blur, modalGray, showDownlodLink, showDownloader} = props;
  const [isLoading, setLoading] = useState(true)
  const [zoom, setZoom] = useState(1)
  const {isGray, setModalConf} =  useContext(Gray);
  async function downloadImage() {
     let imageSrc = imgURL;
    const imageResp = await fetch(imageSrc)
    const imageBlog = await imageResp.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement('a')
    link.href = imageURL
    link.download = image.author
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  let showGray = modalGray !== null ? modalGray : isGray;
  let zoomStyle = { transform: `scale(${zoom})`, left: `${(zoom - 1) * 50}%`, top: `${(zoom - 1) * 50}%`}

  let imgURL = useMemo(() => {
       let blurNum = Number(blur);
       let downloadUrl = image && image.download_url;
      let qParam = {
        blur: blurNum, 
        grayscale: {addOnlyProperty: showGray} 
      }
      return `${downloadUrl}/?${serialize(qParam)}`
  }, [showGray, blur])

  function zoomIn() {
     setZoom(zoom + 1)
  }

  function zoomOut() {
    if (zoom !== 1) {
      setZoom(zoom - 1)
    }
   
  }

  return (
    <div className='img-ctr'>
       <h4 className={isLoading ? '' : 'hide'}> Loading </h4>
       <div className='img-holder'>
         <img onClick={() => setModalConf(image)} style={zoomStyle} class="image-view" onLoad={() => setLoading(false)} src={imgURL} alt="Sorry" />
       </div>
       <div className='zoomer'>
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>-</button>
       </div>
      
      {showDownloader && 
      <a className='downloader' onClick={downloadImage} download>Download image</a>
      }
       {showDownlodLink && 
           (
             <Fragment>
              <div>The image link is provided below. You can copy and share it </div>
              <div className='image-url'> {imgURL} </div>
             </Fragment> 
              

           )
           
      }
    </div>
    
  )
}

function ImageCtr(props) {
  const { images } = props;
  const { setModalConf} =  useContext(Gray);



  const imageComp = images.map((image, i) => {
    return (
      <div key={i} className="img-container-li">
        <ImageView modalGray={null} image={image} />
        <div>{image.author}</div>

      </div>
    )
  });
  return <Fragment>{imageComp}</Fragment>;
}

export default {ImageCtr, ImageView} ;
