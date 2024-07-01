'use client'

import { configureStore } from '@reduxjs/toolkit'
import setImageLoading from './image-size-reducer/reducers'
export default configureStore({
  reducer: {
    imagesLoading:setImageLoading
  },
})