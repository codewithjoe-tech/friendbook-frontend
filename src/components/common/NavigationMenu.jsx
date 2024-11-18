import {
    House,
    Search,
    Video,
    PlusCircle,
    MessageCircle,
    Bell,
    User,
  } from "lucide-react";
  
  import { NavLink } from "react-router-dom";
  import React, { useState } from "react";
  import { useSelector, useDispatch } from "react-redux";
  import { logout } from "@/redux/Slices/UserSlice/UserSlice";
  import { setModalOpen } from "@/redux/Slices/PostSlice";
  import SearchUsers from "./SearchUsers";
  import Notification from "./Notification";
import { NotiOpen } from "@/redux/Slices/NotificationSlice";
  
  const NavigationMenu = () => {
    const [openSearch, setOpenSearch] = useState(false);
   
    const { user } = useSelector((state) => state.users);
    const dispatch = useDispatch();
  
    const toggleSearch = () => setOpenSearch(!openSearch);
    const toggleNotifications = () => dispatch(NotiOpen())
  
    return (
      <>
        <div className="md:hidden fixed w-full flex justify-between h-14 bg-background bottom-0">
          <ul className="flex justify-between items-center w-full h-full">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-foreground bg-white" : "text-foreground"
                }
              >
                <House className="transition" />
              </NavLink>
            </li>
            <li>
              <button
                onClick={toggleSearch}
                className="text-foreground hover:bg-white transition rounded-full p-2"
              >
                <Search className="transition" />
              </button>
            </li>
            <li>
              <NavLink
                to="/reels"
                className={({ isActive }) =>
                  isActive ? "text-foreground bg-white" : "text-foreground"
                }
              >
                <Video className="transition" />
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => dispatch(setModalOpen())}
                className="text-foreground hover:bg-white transition rounded-full p-2"
              >
                <PlusCircle className="transition" />
              </button>
            </li>
            <li>
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  isActive ? "text-foreground bg-white" : "text-foreground"
                }
              >
                <MessageCircle className="transition" />
              </NavLink>
            </li>
            <li>
              <button
                onClick={toggleNotifications}
                className="text-foreground hover:bg-white transition rounded-full p-2"
              >
                <Bell className="transition" />
              </button>
            </li>
            <li>
              <NavLink
                to={`/profile/${user?.username}`}
                className={({ isActive }) =>
                  isActive ? "text-foreground bg-white" : "text-foreground"
                }
              >
                <User className="transition" />
              </NavLink>
            </li>
          </ul>
        </div>
  
        {/* Modals */}
        <SearchUsers open={openSearch} onClose={toggleSearch} />
        <Notification />
      </>
    );
  };
  
  export default NavigationMenu;
  