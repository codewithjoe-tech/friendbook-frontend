import { showToast } from '@/redux/Slices/ToastSlice'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CheckAdmin = ({children}) => {
    const {user}= useSelector((state)=>state.users)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
      if(user?.user_status==='normal'){
        navigate('/')
        dispatch(showToast({message: 'Unauthorized access', type: 'e'}))
      }
    }, [user])
    
  return (
    <>
    {children}
    </>
  )
}

export default CheckAdmin