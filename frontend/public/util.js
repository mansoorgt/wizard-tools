export const addErrorToInput = (input,message,empty) => {
    let error_element=document.createElement('div')
    input.classList.add('error')
    error_element.innerHTML=message
    error_element.className='error-input-message'
    let message_elem =input.parentNode.insertBefore(error_element, input.nextSibling)


    if (empty){
        input.onkeyup= function () {
            removeErrorMessage(input,message_elem)
        }
    }

}

function removeErrorMessage(input,message_elem){
   message_elem.remove();
   input.classList.remove('error')
   console.log("message");
}

export const getDataWithKey = (datas=[],key='name',value='') => {
   
   for (let i = 0; i < datas.length; i++) {
        if (datas[i][key]==value){
      
            return datas[i]
        }
    }

}
export const downloadFile = (blob,file_name) =>{
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file_name);
    document.body.appendChild(link);
    link.click();
}