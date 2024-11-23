import Spinner from '@/components/common/Spinner'
import { showToast } from '@/redux/Slices/ToastSlice'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const {uid,token} = useParams()
    const dispatch= useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
      const verifyUserEmail = async()=>{
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify/${uid}/${token}`)
          const res = await response.json()
          if (response.ok) {
            dispatch(showToast({
                message:"Email verified successfully",
                type:"s"
            }))
           
          }else{
            throw new Error(res.message)
          }
        }catch (error){
            console.error(error)
            dispatch(showToast({
                message:error.message || "An unexpected error occurred",
                type:"e"
            }))
            
          
        }finally{
            
            navigate('/login')
        }
      }
      verifyUserEmail()
      
    }, [])
    
  return (
    <div className='w-full flex h-screen justify-center items-center'>
        
        <Spinner />
    </div>
  )
}

export default VerifyEmail