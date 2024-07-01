
import { createSlice } from '@reduxjs/toolkit'

export const imagesLoading = createSlice({
    name:'imagesLoading',
    initialState:{
        value:false
    },
    reducers:{

        setImageLoading:(state,action)=>{
            console.log(state.value,'image loading');
            state.value=action.payload
        }
    }
})
export const {setImageLoading} = imagesLoading.actions
export default imagesLoading.reducer