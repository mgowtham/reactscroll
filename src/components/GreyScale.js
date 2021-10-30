
import { Fragment, useState, useContext} from "react";

function GreyScale(props) {
    const {updateGray } = props;
    function updateChecked(event) {
      updateGray(event.currentTarget.checked)
    }
    return (
      <Fragment>
         <input onChange={updateChecked} type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
         <label for="vehicle1"> Enable gray scale </label><br></br>
      </Fragment>  
     
    );
}

export default GreyScale