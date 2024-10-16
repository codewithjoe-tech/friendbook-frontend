import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { refreshThunk } from './redux/thunks/getRefreshThunk';
import { logout } from './redux/Slices/UserSlice/UserSlice';
import { profileThunk } from './redux/thunks/getProfileThunk';

const Authenticate = ({ children }) => {
    const { isLoggedIn, loading } = useSelector((state) => state.users); 
    const navigate = useNavigate();  
    const dispatch = useDispatch();

    useEffect(() => {
        const checkUser = async () => {
             dispatch(refreshThunk());
            if(!isLoggedIn){
                navigate('/login')
            }else{
                dispatch(profileThunk())
            }
           
        };

        if (!loading) {
            checkUser();
        }

    }, [dispatch, isLoggedIn, loading, navigate]);

   
    

    if (loading) {
        return <div>Loading...</div>; 
    }

    return <>{children}</>;
};

export default Authenticate;
