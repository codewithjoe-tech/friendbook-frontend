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
                        is_following: data.follow_status
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
            {user?.user?.username !== currentUser?.username ? (
        <>
            {user?.user && (
                <>
                    <Button
                        onClick={() => followUser(user?.user?.username)}
                        className={`font-semibold px-4 py-2 rounded-lg transition duration-200 hover:shadow ${
                            user?.is_following === 'f'
                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                : user?.is_following === 'r'
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-blue-700 text-white hover:bg-blue-800 '
                        }`}
                    >
                        {user?.is_following === 'f'
                            ? 'Following'
                            : user?.is_following === 'r'
                            ? 'Requested'
                            : 'Follow'}
                    </Button>
                    {user?.is_following === 'f' && (
                        <Button
                            // onClick={goToChat}
                            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-200 hover:shadow"
                        >
                            Message
                        </Button>
                    )}
                </>
            )}
        </>
    ) : (
        <Link
            to="/settings"
            className="bg-blue-50 font-semibold text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-200 hover:shadow"
        >
            Edit Profile
        </Link>
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