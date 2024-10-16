import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/Slices/UserSlice/UserSlice';
import { useNavigate } from 'react-router-dom';
import NProgress from "nprogress";
import "nprogress/nprogress.css"; 
import { showToast } from '@/redux/Slices/ToastSlice';


const Login = () => {
  const [loginCred, setLoginCred] = useState({});
 
  const dispatch = useDispatch();
 

  
 
  const loginUser = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginCred),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(showToast({
            message: "Logged in successfully",
            type: "s",
           
        }))
        NProgress.start()
        dispatch(login(data)); 
        return data;
    }else{
        if(data?.non_field_errors)
        dispatch(showToast({
            message: "Verify your email address an email is send",
            type: "e",
           
        }))
        else{
            dispatch(showToast({
                message: "Invalid credentials",
                type: "e",
               
            }))
        }
        console.log(data)
        return data
    }
   
  };

 
  const handleChange = (e) => {
    setLoginCred({ ...loginCred, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser();
    console.log(data)
    

 
  
   
  };

  
 

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <Input required={true} name="username" type="text" onChangeCapture={handleChange} placeholder="Email or Username" className="my-5 bg-input border-2 rounded-lg focus" />
        <Input required={true} name="password" type="password" onChangeCapture={handleChange} placeholder="Password" className="my-5 bg-input rounded-lg" />
        <Button type="submit" variant className="w-full disabled:text-muted">Sign in</Button>
      </form>
    </div>
  );
};

export default Login;
