import { RadioIcon } from 'lucide-react'
import { SearchIcon } from 'lucide-react'
import { PlusCircleIcon } from 'lucide-react'
import { BellRingIcon } from 'lucide-react'
import { SettingsIcon } from 'lucide-react'
import { MessageCircle } from 'lucide-react'
import { UserCircleIcon } from 'lucide-react'
import { HomeIcon } from 'lucide-react'
import React from 'react'

import { Link } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector } from 'react-redux'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '@/redux/Slices/UserSlice/UserSlice'
import { useNavigate } from 'react-router-dom'
import { ModeToggle } from './ThemeDrop'
import { UserCheck } from 'lucide-react'
import { setModalOpen } from '@/redux/Slices/PostSlice'
import { Button } from '../ui/button'
import SearchUsers from './SearchUsers'



const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { userImage, user,profileId } = useSelector((state) => state.users)
    const postModalOpen = useSelector((state)=>state.post.postModalOpen)
    const [openSearch, setOpenSearch] = useState(false)

    const toggleSearch = () => {
        setOpenSearch(!openSearch)
    }
  
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')

    }
    return (
        <div className='hidden md:block lg:w-[18rem] h-screen bg-muted dark:bg-muted/30   sticky left-0 top-0 '>
            <div className="flex flex-col justify-center px-3">
                <div className="logo flex  items-center h-20">
                    <Link to="/" ><h1 className="text-2xl px-2  font-semibold">FriendBook</h1></Link>
                </div>
                <div className="nav-links">
                    <div className="flex flex-col justify-center text-sm font-semibold ">
                        <Link className='py-4 hover:bg-muted-foreground dark:hover:bg-muted px-3 transition duration-100 rounded-lg flex gap-2 items-center' to="/"> <HomeIcon />Home</Link>
                        <button onClick={toggleSearch} className='py-4 hover:bg-muted-foreground dark:hover:bg-muted px-3 transition duration-100 rounded-lg flex gap-2 items-center' to="/"><SearchIcon /> Search</button>
                        <Link className='py-4 hover:bg-muted-foreground dark:hover:bg-muted px-3 transition duration-100 rounded-lg flex gap-2 items-center' to="/"><RadioIcon /> Reels</Link>
                        <button onClick={()=>{dispatch(setModalOpen())}} className='py-4 hover:bg-muted-foreground dark:hover:bg-muted px-3 transition duration-100 rounded-lg flex gap-2 items-center' to="/"><PlusCircleIcon /> Create</button>
                        <Link className='py-4 hover:bg-muted-foreground dark:hover:bg-muted px-3 transition duration-100 rounded-lg flex gap-2 items-center' to={"/profile/"+`${user?.username}`}> <UserCircleIcon /> Profile</Link>
                        <Link className='py-4 hover:bg-muted-foreground dark:hover:bg-muted px-3 transition duration-100 rounded-lg flex gap-2 items-center' to="/notifications"> <BellRingIcon /> Notifications</Link>
                        <Link className='py-4 hover:bg-muted-foreground dark:hover:bg-muted px-3 transition duration-100 rounded-lg flex gap-2 items-center' to="/messages"> <MessageCircle /> Messages</Link>
                        <Link className='py-4 hover:bg-muted-foreground dark:hover:bg-muted px-3 transition duration-100 rounded-lg flex gap-2 items-center' to="/settings"> <SettingsIcon />Settings</Link>
                     {
                        user?.user_status !=='normal' && (
                            <Link className='py-4 hover:bg-muted-foreground dark:hover:bg-muted px-3 transition duration-100 rounded-lg flex gap-2 items-center' to="/admin/home"> < UserCheck/>Admin</Link>
                        )
                     }
                        <ModeToggle buttonName={"Theme"} />
                    </div>
                </div>
                <div className="absolute bottom-8  w-full flex text-white">
                    <DropdownMenu

                        open={isOpen}
                        onOpenChange={(open) => setIsOpen(open)}
                    >

                        <DropdownMenuTrigger asChild>
                            <div className="flex  items-center w-full gap-24  cursor-pointer text-foreground">
                                <div className="flex items-center gap-3  text-foreground">
                                    <img  className='rounded-full w-10 h-10 object-cover' src={userImage} alt="" />

                                    <p className=''>{user?.full_name}</p>
                                </div>
                                <ChevronRight className={isOpen && '-rotate-90 transition duration-200  '} />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-muted text-forground w-[16rem] ml-4">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                          
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
                     <SearchUsers open={openSearch} onClose={toggleSearch} />

        </div>
    )
}

export default Sidebar