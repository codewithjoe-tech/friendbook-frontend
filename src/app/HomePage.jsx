
import StoryComponent from '@/components/HomeComponents/StoryComponent'
import { profileThunk } from '@/redux/thunks/getProfileThunk'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

const HomePage = () => {
    const {} = useSelector((state) =>state.users)
    const dispatch = useDispatch()
   
    
  return (
    <div className='w-[70%] mx-auto flex flex-col justify-center  h-screen overflow-x-hidden'>
       
        {/* <StoryComponent /> */}
        <div className="flex h-full w-full py-4">

        </div>
    </div>
  )
}

export default HomePage