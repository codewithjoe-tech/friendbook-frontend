import { ThemeProvider } from "@/providers/theme-provder";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; 
import React,{Suspense} from "react";

import LoginPage from "./app/LoginPage";
import HomePage from "./app/HomePage";
import MainLayout from "./layouts/MainLayout";
import GoogleAuth from "./app/GoogleAuth";
import VerifyEmail from "./app/VerifyEmail";
import Settings from "./app/Settings";
import OtherProfile from "./app/Profiles";
import Spinner from "./components/common/Spinner";

const AdminLayout = React.lazy(()=>import("./layouts/AdminLayout"))
const AdminHome = React.lazy(()=>import("./app/admin/AdminHome"))

function App() {
    const router = createBrowserRouter([
        {
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/auth/google/callback/",
            element: <GoogleAuth />,
        },
        {
            path:"/verify-email/:uid/:token/",
            element:<><VerifyEmail /> </>
        },
        {
            path: "/",
            element: <MainLayout />,
            children: [
                {
                    path: "/",
                    element: <HomePage />,
                },
                
                {
                    path:"/settings",
                    element:<Settings/>
                },
                {
                    path:"/profile/:id",
                    element:<OtherProfile />
                },
            ],
        },
        {
            path:"/admin/",
            element:<Suspense fallback={<>
            <div className="w-full h-screen flex justify-center items-center">
                <Spinner/>
            </div>
            </>}>
                <AdminLayout/>
            </Suspense>,
            children:[
                {
                    path:"home",
                    element:<Suspense fallback={<>
                    <div className="w-full h-screen flex justify-center items-center">
                        <Spinner/>
                    </div>
                    </>}>
                        <AdminHome />
                    </Suspense>
                }
            ]
        }
    ]);

    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                
                <RouterProvider router={router} />
            </ThemeProvider>
        </>
    );
}


export const RouteChangeHandler = () => {
    const location = useLocation();

    useEffect(() => {
        NProgress.start(); 
        setTimeout(() => {
            NProgress.done();
        }, 1000); 
       
    }, [location]);

    return (
        <>
        
        </>
    );
};

export default App;
