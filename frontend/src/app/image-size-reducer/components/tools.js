"use client"
import { RadioButton } from 'primereact/radiobutton';
import { useState ,useEffect } from "react";
import { Button } from 'primereact/button';
import { Slider } from 'primereact/slider';
// import { Percent } from "@styled-icons/fa-regular";
import { faPercent , faArrowRight ,faDownload , faDownLeftAndUpRightToCenter, faL } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import {  getDataWithKey ,downloadFile } from "../../../../public/util";
import {setImageLoading} from '../../../redux/image-size-reducer/reducers'
import { useSelector, useDispatch } from 'react-redux'

const Tools = ({uuidFolderName,setCurrentImages,currentImages}) =>{

    const [method, setMethod] = useState('percentage');
    const [percentage,setPercentage]=useState(50)
    
    const dispatch=useDispatch()


    const onResize = () =>{
        // setloadingImages(true)
        dispatch(setImageLoading(true))
        let _data={
            'uuid_folder_name':uuidFolderName,
            
            'tool_options': {
                'method':method,
                'settings': method == 'percentage' ? {'quality':percentage} :{}
            }
        }

        axios.post(process.env.NEXT_PUBLIC_API_PORT+'/image-size-reducer/resize',_data).then((res)=>{
            
            let new_images_data=[]

            currentImages.forEach(element => {
                console.log(element);
                let current_image_data=element

                let new_image_data=getDataWithKey(res.data.optimized_data.result,'name',element.optimized_data.name)
                current_image_data['optimized_data']=new_image_data
                new_images_data.push(current_image_data)
        
            });

            setCurrentImages(new_images_data)
            // setloadingImages(true)
            dispatch(setImageLoading(false))
        })
       
    }

    const download_all = ()=>{
        console.log('download all');
        axios.get(process.env.NEXT_PUBLIC_API_PORT+'/image-size-reducer/download-all',{'params':{'uuid_folder_name':uuidFolderName},responseType:'blob'}).then((res)=>{
            
            let file_name=`${new Date().toDateString()}-optimized-image(by wizard-tools).zip`
            downloadFile(res.data,file_name)

        })
    }
    return(
        <div className=" h-full tool-card" >
           
           <div className='tool-page-h2 border-b-2'>Tool</div>
            <div className='grid-rows-4	grid h-full'>

            {/* <div className='row-span-1 '>
            <div className='grid grid-cols-2'>
                    <div className='col-span-2 my-2 text-gray-500 label-head'>Method</div>
                    <div className='flex '>
                        <RadioButton inputId="method-1" name="percentage" value="percentage" onChange={(e) => setMethod(e.value)} checked={method === 'percentage'} />
                        <label htmlFor="method-1" className="ml-2">Percentage </label>
                        
                    </div>

                    <div className='flex'>
                    <RadioButton inputId="method-2" name="dimensions" value="dimensions" onChange={(e) => setMethod(e.value)} checked={method === 'dimensions'} />
                    <label htmlFor="method-2" className="ml-2">Dimensions</label>
                    </div>
                </div>
            </div> */}

            <div className='row-span-3 place-content-center w-full' >
         <div className='w-full'>
            <div className='my-2 text-gray-500 label-head'>Image Quality</div>
            <Slider value={percentage} onChange={(e) => setPercentage(e.value)} step={5} />
            
                <div className='place-content-center flex'> 
                <div className=' place-items-center mt-2'>{percentage} <FontAwesomeIcon icon={faPercent}></FontAwesomeIcon> </div>
                </div>
            </div>
            </div>
            <div className='row-span-1 h-full place-content-center flex' >
                <div>
                <Button label='Re Size' className='mx-2' onClick={onResize} rounded={true} ><FontAwesomeIcon className='mx-1' icon={faDownLeftAndUpRightToCenter} /> </Button>
                <Button label='Download' severity="success" onClick={download_all} className='mx-2' rounded={true} ><FontAwesomeIcon className='mx-1' icon={faDownload} /></Button>
                 
                </div>
                

            </div>
{/* 
            <div className='row-span-1 grid flex place-content-center'>
               
                <span className='place-items-center flex'> <div className='mx-2' >Image Resized </div> <p>12</p> <FontAwesomeIcon icon={faArrowRight} style={{fontSize:'20px'}} className='mx-2' /> <p>12</p> </span>
            </div> */}
            

            </div>
        </div>
    )
}
export default Tools