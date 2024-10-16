import Spinner from '@/components/common/Spinner';
import Toast from '@/components/common/Toast';
import { showToast } from '@/redux/Slices/ToastSlice';
import { login } from '@/redux/Slices/UserSlice/UserSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleAuth = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const error = queryParams.get('error');
    const state = queryParams.get('state');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google/callback/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, state }),
                });
                
                const data = await response.json();

              
                if (response.ok) {
                    dispatch(login(data));
                    navigate('/');
                } else {
                    dispatch(showToast({ message: "Account Banned",type:'e'}))
                    console.error('Error during authentication', data);
                    navigate('/login');
                }
            } catch (err) {
               
                console.error('Error fetching user data', err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        if (error) {
            console.error('Authentication error:', error);
            navigate('/login');
        } else if (code && state) {
            fetchUser();
        } else {
            navigate('/login');
        }
    }, [ ]);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Toast />
                <Spinner />
            </div>
        );
    }

    return null; 
};

export default GoogleAuth;




