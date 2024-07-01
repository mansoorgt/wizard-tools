"use client"
import axios from 'axios';
import {  useState } from 'react';
import {  addErrorToInput } from "../../../public/util";
const SiteMapAnalyzer = () =>{
      

    const [currentJobStatus,setCurrentJobStatus]=useState('Not-Queued')
    const [currentJobResult , setcurrentJobResult]=useState()
    

    
    const  checkSitemap = () =>  {
        let _url_input=document.getElementById("sitemap-url-input")
       let _url=_url_input.value

       if (_url == ''){
        addErrorToInput(_url_input,'Please add a sitemap url to check' , true)
        return false
       }

       
       axios.post(process.env.NEXT_PUBLIC_API_PORT+'/analyze-sitemap-xml/',{"url":_url}).then((res)=>{
            
        setCurrentJobStatus('Queued')
            var refreshJobStatusIntervalID = setInterval(()=>{
                axios.get(process.env.NEXT_PUBLIC_API_PORT+`/get-job/?job_id=${res.data.job_id}`).then((res)=>{
                    
                    if (res.data.status == "finished"){
                        let total_success=0
                        let total_failed=0


                        res.data.result.forEach(element => {
                            console.log(element);
                            if (element.status === 200) {
                                total_success++;
                            }else{
                                total_failed++
                            }  
                        });

                        let final_result={
                            'total_urls':res.data.result.length,
                            'total_success_urls':total_success,
                            'total_failed_urls':total_failed,
                            'urls':res.data.result
                        }
                       
                        setcurrentJobResult(final_result)
                        
                    }
                    setCurrentJobStatus(res.data.status)
                    if (res.data.status == "finished" || res.data.status == 'failed' ){
                        
                       
                        clearInterval(refreshJobStatusIntervalID)
                    }
                  

                }).catch((error)=>{
                    console.log(error);
                    clearInterval(refreshJobStatusIntervalID)
                    setcurrentJobResult({})
                })

            },2000)

       })

    }


    return(
        <>
        <div className="flex place-content-center mt-12">
            <h1 className="w-5/6 grid text-center tool-page-main-heading">SiteMap Analyzer</h1>
    
        </div>

        <div className='flex place-content-center mt-4'>  
        
        <div className='w-3/6'>
        <input type="text" className="w-full " id="sitemap-url-input" placeholder="Pate here sitemap link" />

        </div>
        
        <button className='main-btn btn-blue mx-1' disabled={currentJobStatus != 'Not-Queued' && currentJobStatus != 'finished' && currentJobStatus != 'failed' } onClick={()=>checkSitemap()}>Check</button>
    
        </div>
        
        {currentJobStatus != 'Not-Queued' &&
        <div className=" w-full h-96 mt-2 tool-result-card ">

            <div className="border-b-4 border-black-500 justify-between	flex "> 
            
            <h2 className="tool-page-h2">Result</h2>
            {currentJobStatus == 'finished' &&
            <>
            {currentJobResult.total_failed_urls == 0 ? 
            <span className='text-green-500 font-bold flex place-content-center my-1'><img src="/tick.svg" className='mx-1' width={'20px'} alt="" /> <p>All urls are good</p>  </span>
            :
            <span className='text-red-500 font-bold flex place-content-center my-1'><img src="/cross.svg" className='mx-1' width={'20px'} alt="" /> <p>Some urls are in not found</p>  </span>
            }
            </>
            }    
            </div>

        {currentJobStatus == 'finished' ?
        <div className="content result-content">
            
            <div className='grid grid-cols-3 my-1'>
                <div className='col-span-2 font-bold'>
                    Scanned Urls
                </div>

                <div className='col-span-1 font-bold'>
                    Summery
                </div>
            </div>

            <div className='grid grid-cols-3 '>
                <div className='col-span-2 overflow-y-auto h-72'>
                  {currentJobResult.urls.map((data,i)=>{
                    return(<div className='text-ellipsis overflow-hidden w-full whitespace-nowrap flex' key={i}> {data.status == 200 ? <img src="/tick.svg" className='mx-1' width={'20px'} alt="" /> :<img src="/cross.svg" className='mx-1' width={'20px'} alt="" /> }  {data.url}</div>)
                  })}
                    
                
                </div>

                <div className='col-span-1'>
                    <div className='result-count ml-1 h-6/5 '>
                            <div className='my-2'>
                            Total urls <span className='rounded-border-number mx-1 font-bold'>{currentJobResult.total_urls}</span> 
                        </div>
                        <div className='my-2'>
                            Success urls<span className='rounded-border-number mx-1 font-bold text-green-500'>{currentJobResult.total_success_urls}</span> 
                        </div>
                        <div className='my-2'>
                            Failed urls<span className='rounded-border-number mx-1 font-bold text-red-500'>{currentJobResult.total_failed_urls}</span> 
                        </div>
                    </div>
              

                   
                
                </div>
            </div>

        </div>
        :

        <div className="content grid place-content-center h-full">
{/* 
        <div className='font-bold text-center text-2xl'>20%</div> */}
        <div className=' capitalize text-center'>Scanning {currentJobStatus}</div>
                  
        <div className="loader my-2"></div>
        <p className='text-center text-gray-500 '>Please wait , it may take some time </p>
        </div>

        }
     


     
        </div>
        }


        </>
    )
}

export default SiteMapAnalyzer