from fastapi import APIRouter ,Request ,UploadFile 
from fastapi.responses import FileResponse
import shutil
import uuid
import os
from pathlib import Path
from includes.utilities import bytes_to_human_readable ,get_files_from_dir
from PIL import Image
from pydantic import BaseModel
import zipfile



router = APIRouter()

media_folder=f"{Path(__file__).parent.parent}/media/image-size-reducer"
@router.post('/image-size-reducer/upload')
def upload_images(files:list[UploadFile]):
    
    # total_size=sum(_file.size for _file in files)
    uuid_folder_name=uuid.uuid4().hex
    folder_path=f"{media_folder}/{uuid_folder_name}/original"
    os.makedirs(folder_path, exist_ok=True)
    
    # image_data=[]
    for image in files:
        
        file_path=f"{folder_path}/{image.filename}"
        #saving with shutil
        with open(file_path,'wb+') as image_obj:
            shutil.copyfileobj(image.file,image_obj)
        
        # image_data.append({'name':image.filename,'size':bytes_to_human_readable(image.size)})
    
    #optimazing the images by 50% quality
    optimized_data=optimize_image(uuid_folder_name)
    
    res={'optimized_data':optimized_data}
    print(optimized_data)
    return res

class resizePost(BaseModel):
    uuid_folder_name:str
    tool_options:dict
    
@router.post('/image-size-reducer/resize')
def resize(data:resizePost):
    optimized_data=optimize_image(data.uuid_folder_name,data.tool_options)
    res={'optimized_data':optimized_data}

    return res
        
@router.get('/image-size-reducer/download-all')
def download_all(uuid_folder_name:str):
    _base=f"{media_folder}/{uuid_folder_name}"
    resized_path=f"{_base}/re-sized"
    _files=get_files_from_dir(resized_path)
    
    if len(_files) == 1:
        res_file=f"{resized_path}/{_files[0]}"
        return FileResponse(res_file)
    else:
        zip_folder=f"{resized_path}/zip/resized.zip"

        
        with zipfile.ZipFile(zip_folder,'w') as f:
            for image in _files:
                f.write(f"{resized_path}/{image}",arcname=os.path.join("", image))
        
        return FileResponse(zip_folder)    
@router.get('/image-size-reducer/download-single')
def download_single(file_name:str,uuid_folder_name:str):
    # res_file=f"{resized_path}/{_files[0]}"
    _base=f"{media_folder}/{uuid_folder_name}"
    file_path=f"{_base}/re-sized/{file_name}"
    return FileResponse(file_path)
    
def optimize_image(uuid_folder_name,tool_option={'method':'percentage','settings':{'quality':50}}):
    
    _base=f"{media_folder}/{uuid_folder_name}"
    original_folder_path=f"{_base}/original"
    new_path=f"{_base}/re-sized"
    
    if not os.path.isdir(new_path):
        os.makedirs(new_path)
    
    result=[]
    for file in get_files_from_dir(original_folder_path):
        new_file_path=f"{new_path}/{file}"
        file_name,extension=os.path.splitext(file)
        extension=extension.replace('.','')
        original_file_path=f"{original_folder_path}/{file}"
        new_img=Image.open(original_file_path)
        
        new_img.save(new_file_path,optimize=True,quality=tool_option['settings']['quality'])
        
        new_file_size=bytes_to_human_readable(os.path.getsize(new_file_path))
        original_file_size=bytes_to_human_readable(os.path.getsize(original_file_path))
        
        result.append({'name':file,'new_size':new_file_size,'original_size':original_file_size})
    
    res={"uuid_folder_name":uuid_folder_name,'result':result}
        
    return res