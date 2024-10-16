import { RouteChangeHandler } from '@/App'
import Login from '@/components/LoginComponents/Login'
import Signup from '@/components/LoginComponents/Signup'
import Toast from '@/components/common/Toast'
import { getCookie } from '@/utils'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import NProgress from "nprogress";
import "nprogress/nprogress.css"; 

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    
    const data = useSelector((state)=>state.users)
    const navigate = useNavigate()
    

    useEffect(() => {
        
         if (data.isLoggedIn) {
             navigate('/'); 
           }
           NProgress.done()
       
     
       }, [ data.isLoggedIn]);
   

    return (
        <>
       
            <Toast />
            <div className='w-full flex justify-center items-center flex-col h-screen'>
                <div className="flex flex-col justify-center items-center border p-8 rounded-lg shadow-2xl">
                    <div className="logo">
                        <h1 className="text-3xl font-bold">FriendBook</h1>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="flex flex-col items-center justify-center w-80 h-full">
                            <div className="w-full max-w-lg">
                                {isLogin ? <Login /> : <Signup setIsLogin={setIsLogin} />}
                                <div className="social-login flex w-full justify-center items-center">
                                    <div className="px-6 sm:px-0 max-w-sm">
                                        <a href={`${import.meta.env.VITE_API_URL}/api/auth/google/login/`} className="w-full bg-muted/100 focus:outline-none hover:bg-muted/75 transition duration-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2">
                                            <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                            </svg>
                                            Sign up with Google
                                            <div></div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isLogin && <div className='flex items-center justify-center gap-3'>
                        <p className="text-center text-xs text-foreground font-semibold">No account?&nbsp; - </p>
                        <button onClick={() => { setIsLogin(false) }} className=''>Join now</button>
                    </div>}
                    {!isLogin && <div className='flex items-center justify-center gap-3'>
                        <p className="text-center text-xs text-foreground font-semibold">I have account?&nbsp; - </p>
                        <button onClick={() => { setIsLogin(true) }} className=''>Login</button>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default LoginPage
