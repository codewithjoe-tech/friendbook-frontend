import { RadioIcon, SearchIcon, PlusCircleIcon, BellRingIcon, SettingsIcon, MessageCircle, UserCircleIcon, HomeIcon, ChevronRight, UserCheck } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/Slices/UserSlice/UserSlice';
import { setModalOpen } from '@/redux/Slices/PostSlice';
import SearchUsers from './SearchUsers';
import Notification from './Notification';
import { NotiOpen } from '@/redux/Slices/NotificationSlice';
import { BellIcon } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userImage, user } = useSelector((state) => state.users);
  const [openSearch, setOpenSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSearch = () => setOpenSearch(!openSearch);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
 
    <div className='hidden lg:block lg:w-[18rem] h-screen bg-muted dark:bg-muted/30 sticky left-0 top-0'>
      <div className="flex flex-col h-full px-3">
  
        <div className="pt-6">
     
          <div className="logo flex items-center mb-4">
            <Link to="/" className="text-2xl font-semibold">FriendBook</Link>
          </div>
    
          <div className="nav-links flex flex-col text-sm font-semibold space-y-2">
            <Link className='py-3 hover:bg-muted-foreground dark:hover:bg-muted px-3 rounded-lg flex items-center gap-2' to="/">
              <HomeIcon /> Home
            </Link>
            <button onClick={toggleSearch} className='py-3 hover:bg-muted-foreground dark:hover:bg-muted px-3 rounded-lg flex items-center gap-2'>
              <SearchIcon /> Search
            </button>
            <Link className='py-3 hover:bg-muted-foreground dark:hover:bg-muted px-3 rounded-lg flex items-center gap-2' to="/reels/">
              <RadioIcon /> Reels
            </Link>
            <button onClick={() => dispatch(setModalOpen())} className='py-3 hover:bg-muted-foreground dark:hover:bg-muted px-3 rounded-lg flex items-center gap-2'>
              <PlusCircleIcon /> Create
            </button>

            <button onClick={() => dispatch(NotiOpen())} className='py-3 hover:bg-muted-foreground dark:hover:bg-muted px-3 rounded-lg flex items-center gap-2'>
              <BellIcon /> Notification
            </button>
            <Link className='py-3 hover:bg-muted-foreground dark:hover:bg-muted px-3 rounded-lg flex items-center gap-2' to={`/profile/${user?.username}`}>
              <UserCircleIcon /> Profile
            </Link>
            <Link className='py-3 hover:bg-muted-foreground dark:hover:bg-muted px-3 rounded-lg flex items-center gap-2' to="/messages/">
              <MessageCircle /> Messages
            </Link>
            <Link className='py-3 hover:bg-muted-foreground dark:hover:bg-muted px-3 rounded-lg flex items-center gap-2' to="/settings">
              <SettingsIcon /> Settings
            </Link>
            {user?.user_status !== 'normal' && (
              <Link className='py-3 hover:bg-muted-foreground dark:hover:bg-muted px-3 rounded-lg flex items-center gap-2' to="/admin/home">
                <UserCheck /> Admin
              </Link>
            )}
          </div>
        </div>

       
        <div className="mt-auto pb-6">
          <DropdownMenu
            open={isOpen}
            onOpenChange={(open) => setIsOpen(open)}
          >
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-between w-full cursor-pointer text-foreground">
                <div className="flex items-center gap-3">
                  <img className='rounded-full w-10 h-10 object-cover' src={userImage} alt="User" />
                  <p>{user?.full_name}</p>
                </div>
                <ChevronRight className={isOpen ? '-rotate-90 transition duration-200' : ''} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-muted w-[16rem] mt-2">
              <DropdownMenuItem className="text-foreground" onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

  
      <SearchUsers open={openSearch} onClose={toggleSearch} />
      <Notification />
    </div>
  );
};

export default Sidebar;
