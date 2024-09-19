import { RouteChangeHandler } from '@/App'
import Authenticate from '@/authenticate'
import Sidebar from '@/components/common/Sidebar'
import Toast from '@/components/common/Toast'
import UploadModal from '@/components/common/UploadModal'
import { setModalOpen } from '@/redux/Slices/PostSlice'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    const postModalOpen = useSelector((state)=>state.post.postModalOpen)
    const dispatch = useDispatch()
    useEffect(() => {
      console.log("This is also working")
    }, [postModalOpen])
    
  return (
    <>
    <RouteChangeHandler />
    <Authenticate>
        <Toast />
    <div className="flex gap-16 ">

   <div className="basis-14">
   <Sidebar />
   </div>
   {
    postModalOpen && <UploadModal  isOpen={postModalOpen} onClose={()=>{dispatch(setModalOpen())}} />
   }
    <Outlet />

    </div>
    </Authenticate>
    </>
  )
}

export default MainLayout