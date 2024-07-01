"use client"
import { useEffect, useState  } from "react";
import ToolPageHead from "../../components/toolPageHead"

import SelectImageInput from "./components/selectImageInput";
import Tools from "./components/tools";
import SelectImages from "./components/selectedImage";
import store from "@/redux/store";
import { Provider } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux'

const imageSizerReducer = () =>{

    const[currentImages,setCurrentImages]=useState(null)
    const [uuidFolderName, setuuidFolderName] = useState('');
    // const loadingImages=useSelector((state)=>state.imagesLoading.value)
    // const [loadingImages, setloadingImages] = useState(false);
    
    return(
        <>
        <ToolPageHead head={'Image Size Reducer'} />
        <Provider store={store}>
        <div className="grid grid-cols-4">
            
           <div className="md:col-span-2 col-span-4 m-2">
           
       
            {currentImages ?  <SelectImages uuidFolderName={uuidFolderName} currentImages={currentImages} />: <SelectImageInput setCurrentImages={setCurrentImages} setuuidFolderName={setuuidFolderName} /> }
           
            </div>
            <div className="md:col-span-2 col-span-4 m-2">    
                <Tools uuidFolderName={uuidFolderName} currentImages={currentImages} setCurrentImages={setCurrentImages} />
            </div>
        </div>
        </Provider>
        </>
    )
}
export default imageSizerReducer