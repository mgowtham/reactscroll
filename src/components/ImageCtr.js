import { Fragment, useContext, useMemo, useState } from "react";
import "./ImageCtr.css";
import Gray from "../contexts/Grayscale";

function ImageView(props) {
  const { image , blur, modalGray, showDownlodLink, showDownloader} = props;
  const [isLoading, setLoading] = useState(true)
  const {isGray, setModalConf} =  useContext(Gray);
  async function downloadImage() {
     let imageSrc = imgURL;
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'Hi'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  let showGray = modalGray !== null ? modalGray : isGray;

  let imgURL = useMemo(() => {
      let url = ''
      let downloadUrl = image && image.download_url;
      let blurNum = Number(blur);
      if (blurNum && showGray) {
         return `${downloadUrl}/?grayscale&blur=${blur}` 
      } else if (blurNum) {
        return `${downloadUrl}/?blur=${blur}` 
      } else if (showGray) {
        return `${downloadUrl}/?grayscale` 
      }
      return downloadUrl
  }, [showGray, blur])

  return (
    <div className='img-ctr'>
       <h4 className={isLoading ? '' : 'hide'}> Loading </h4>
       <img class="image-view" onLoad={() => setLoading(false)} src={imgURL} alt="Sorry" />
      {showDownloader && 
      <a  onClick={downloadImage} download>Download image</a>
      }
       {showDownlodLink && 
           (
             <Fragment>
              <div>The image link is provided below </div>
              <div> {imgURL} </div>
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
      <div key={i} className="img-ctr">
        <ImageView modalGray={null} image={image} />
        <div>{image.author}</div>
        <button onClick={() => setModalConf(image)}>Open in modal</button>

      </div>
    );
  });
  return <Fragment>{imageComp}</Fragment>;
}

export default {ImageCtr, ImageView} ;
