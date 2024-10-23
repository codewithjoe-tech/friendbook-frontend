import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from '../ui/input'
import { useState } from 'react'
import { useEffect } from 'react'
import { getCookie } from '@/utils'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'



const SearchUsers = ({ open, onClose }) => {

  const [users, setUsers] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const access = getCookie('accessToken')
  const {user:currentUser} = useSelector(state=>state.users)
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

  const handleChange = (e)=>{
    const { value } = e.target;
    setSearchValue(value)
    
  }

  const fetchUsers = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/search/?q=${searchValue}`,{
        headers: {
           'Authorization': 'Bearer ' + access
        }
      })
      const data = await response.json()
      if(response.ok){
        setUsers(data)
      }else{
        setUsers([])
      }
  }


  useEffect(() => {
    if(open){
      fetchUsers()
    }
  }, [searchValue])
  

  return (
    <Sheet open={open} onOpenChange={onClose} >
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Search For User</SheetTitle>
          <SheetDescription>
            <Input placeholder={"Search..."} onChangeCapture={handleChange}/>
          </SheetDescription>
        </SheetHeader>

        <div>
          {users.length > 0 ?
          (  users.map((user) => (
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

             
              </div>
            ))):(
              <p className='text-center mt-10 text-muted-foreground/50'>No Users</p>
            )
          }
        </div>
      </SheetContent>
    </Sheet>

  )
}

export default SearchUsers