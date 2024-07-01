'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload } from '@fortawesome/free-solid-svg-icons'

import { Badge } from 'primereact/badge';
import { downloadFile } from "../../../../public/util";
import { useState } from "react"
import axios from "axios";

const SelectImages = ({currentImages,uuidFolderName}) => {
    console.log((uuidFolderName));
    const downloadSingleFile = (file_name) =>{
        axios.get(process.env.NEXT_PUBLIC_API_PORT+'/image-size-reducer/download-single',{'params':{'file_name':file_name,'uuid_folder_name':uuidFolderName,},responseType:'blob'}).then((res)=>{
            
            downloadFile(res.data,file_name)

        })
    }
    return(
        <div className="h-96 tool-card w-full text-center overflow-y-auto " >
            
            {currentImages.map((elm,index) => {
                return(
                <div className="grid grid-cols-6 mb-1 rounded-lg p-1 my-shadow-sm rounded h-20" key={index}>
                    <img src={elm.blob_url} className="image-reducer-selected-image h-16 w-16 m-1 rounded place-self-center" />
                    <div className="col-span-3 ml-1 grid grid-rows-2 text-start font-semibold ">
                        <div className="truncate">{elm.optimized_data.name}</div>
                        <Badge value={<del>{elm.optimized_data.original_size}</del>} severity="danger" className="w-16" />
                    </div>
                    <div className="col-span-2 place-items-center grid" >
                            
                            <Badge className=" hover:bg-green-700 cursor-pointer" severity="success" onClick={()=>{downloadSingleFile(elm.optimized_data.name)}} value={<> {elm.optimized_data.new_size} <FontAwesomeIcon icon={faDownload} /></>}>
                            
                            </Badge>
                       
                    </div>
                </div>
                )
            })}
   
          
        </div>
    )
}
export default SelectImages