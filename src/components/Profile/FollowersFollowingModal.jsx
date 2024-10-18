import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useEffect } from 'react'
import { useState } from 'react'
import { getCookie } from '@/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { followUserThunk } from '@/redux/thunks/getProfileThunk'
import { showToast } from '@/redux/Slices/ToastSlice'

  


const FollowersFollowingModal = ({open,onClose, url}) => {
    const [users, setUsers] = useState([])
    const {user:currentUser} = useSelector((state)=>state.users)
    const dispatch = useDispatch()
    const access = getCookie('accessToken')
    const fetchUsers = async () => {
        const response = await fetch(url,{
            headers: {
               'Authorization': 'Bearer ' + access
            }
        })
        const data = await response.json()
        console.log(data)
        setUsers(data)
    }

    useEffect(() => {
        console.log()
      if(open){
        fetchUsers()
      }else{
        setUsers([])
      }
    }, [open])

    const followUser = async (id) => {
        try {

            const data = await dispatch(followUserThunk(id)).unwrap();

            setUsers(users.map((user) => {
                if (user?.user?.username === id) {
                    return {
                        ...user,
                        is_following: !user.is_following
                    };
                }
                return user;
            }));

            


            dispatch(showToast({ message: data.message, type: "s" }))

        } catch (error) {
            dispatch(showToast({ message: error.message, type: "e" }))
        }
    }
  
    
  return (
    <div>
        <Dialog open={open} onOpenChange={onClose}>
          <DialogHeader>
           
          </DialogHeader>
          <DialogContent>
            <DialogTitle>{url.includes('follower')?"Followers" : "Following"}</DialogTitle>
            <DialogDescription>
              {
                users.map((user)=>(
                    <div className="card flex justify-between">
            <Link onClick={onClose} to={`/profile/${user.user.username}`} className="userDetails cursor-pointer flex gap-3 items-center">
            <Avatar className="mt-3 " size="sm">
                  <AvatarImage 
                    className="object-cover "
                    src={user.profile_picture || '/user.webp'} 
                    alt={user.user || 'User Avatar'} 
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
 
                    <div className="flex flex-col mt-3 ">
                        <p className='text-lg font-bold'>{user.user.full_name}</p>
                        <p className='text-xs text-muted-foreground/70'>@{user.user.username}</p>
                    </div>
                
            </Link>

            <div className="flex items-center gap-2">
            { user.user?.username != currentUser.username ?<>
                 
                {!user?.is_following? (<Button size="sm"  onClick={()=>{followUser(user?.user?.username)}}  className=" transition duration-200 hover:shadow bg-blue-700 hover:bg-blue-800 active:bg-blue-900 ">Follow</Button>):(<>
                
                    <Button onClick={()=>{followUser(user?.user?.username)}} size="sm" className="transition duration-200 hover:shadow ">Following</Button>
                    <Button size="sm" className="transition duration-200 hover:shadow  bg-blue-700 hover:bg-blue-800">message</Button>
                </>
                )
                }
             </>:(

                <Link to="/settings" className='text-blue-500'>Edit Profile</Link>
             )}
            </div>
              </div>
                ))
              }
            </DialogDescription>
          </DialogContent>
        </Dialog>
  
    </div>
  )
}

export default FollowersFollowingModal