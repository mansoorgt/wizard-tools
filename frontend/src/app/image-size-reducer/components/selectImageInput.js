"use client"

import { useRef, useState ,useEffect } from "react";
import { faImages, faSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProgressSpinner } from "primereact/progressspinner";
import axios, { Axios } from "axios";
import {  getDataWithKey } from "../../../../public/util";
import { useSelector, useDispatch } from 'react-redux'
import {setImageLoading} from '../../../redux/image-size-reducer/reducers'

const SelectImageInput = ({setCurrentImages,setuuidFolderName}) =>{
    
    const loadingImages=useSelector((state)=>state.imagesLoading.value)
    const dispatch=useDispatch()

    const selectInput=useRef()

    const onClickInput = () =>{
        // document.getElementById('selected-image-input').click()
        selectInput.current.click()
    }
    
    useEffect(() => {
        
        console.log(loadingImages,'uese');
    }, [loadingImages]);

    const onChangeCurrentImages = () =>{

        // setloadingImages(true)
        dispatch(setImageLoading(true))
        
        let formData=new FormData()
   
        for (let i = 0; i < selectInput.current.files.length; i++) {
            formData.append('files',selectInput.current.files[i])
        }

        
        axios.post(process.env.NEXT_PUBLIC_API_PORT+'/image-size-reducer/upload',formData,{headers:{'Content-Type':'multipart/form-data'}}).then((res)=>{

            let image_data=[]

            let images=[...selectInput.current.files]

            images.forEach(elm => {
               
                const blob = new Blob([elm])
                let blob_url=URL.createObjectURL(blob)
                let file_name=elm.name
   
                let optimized_data=getDataWithKey(res.data.optimized_data.result,'name',file_name)
               
                image_data.push({'blob_url':blob_url,'optimized_data':optimized_data})

            })

            setuuidFolderName(res.data.optimized_data.uuid_folder_name)
            setCurrentImages(image_data)
            // setloadingImages(false)
            dispatch(setImageLoading(true))
        })
        
    }
    return(
    <div  className="h-96 mr-2 tool-card border-dashed border-4 border-sky-500  place-content-center" >
        {loadingImages ? 
            <div className="content grid place-content-center h-full" >
            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            <p className="text-gray-500 my-2">Please wait your images is optimizing </p>

            </div>
        :
            <div className="content grid place-content-center h-full  hover:bg-slate-500/10 cursor-pointer" onClick={onClickInput}>
            <FontAwesomeIcon icon={faImages}  style={{color: "#969696", fontSize:'100px'}} />
                <p className="text-center">Choose Image</p>
                <button className='medium-btn btn-blue my-1' onClick={onClickInput}>Select</button>

            </div>
        }
        <input type="file" accept="image/*" ref={selectInput} onChange={onChangeCurrentImages} multiple className="hidden" />
    </div>
    )
}


export default SelectImageInput