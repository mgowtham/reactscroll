
import { Fragment, useState, useContext} from "react";

function GreyScale(props) {
    const {updateGray, defaultValue } = props;
    let [checkStatus, setcheckStatus] = useState(defaultValue);
    function updateChecked(event) {
      setcheckStatus(!checkStatus)
      updateGray(event.currentTarget.checked)
    }
    return (
      <Fragment>
         <input onChange={updateChecked} type="checkbox" id="vehicle1" name="vehicle1" checked={checkStatus}/>
         <label for="vehicle1"> Enable gray scale </label><br></br>
      </Fragment>  
     
    );
}

export default GreyScale