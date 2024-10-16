import { RouteChangeHandler } from '@/App'
import Authenticate from '@/authenticate'
import CheckAdmin from '@/components/admin/CheckAdmin'
import Navbar from '@/components/admin/Navbar'
import Toast from '@/components/common/Toast'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <>
     <RouteChangeHandler />
    <Authenticate>
    <CheckAdmin>


    <Navbar />
    <Toast />
    <div className="w-[70%] mx-auto">
    <Outlet />
    </div>
    </CheckAdmin>

    </Authenticate></>
  )
}

export default AdminLayout