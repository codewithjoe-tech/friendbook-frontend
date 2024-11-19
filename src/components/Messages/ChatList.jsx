import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCookie } from "@/utils";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ChatList = ({ handleOpen }) => {
  const [chatList, setChatList] = useState([]);
  const access = getCookie("accessToken");
  const wsList = useRef(null);
  const { user } = useSelector((state) => state.users);
  const { roomName } = useParams();

  useEffect(() => {
    if (!wsList.current && user) {
      wsList.current = new WebSocket(
        `${import.meta.env.VITE_WS_URL}/ws/chat-list/${user?.username}/?token=${access}`
      );
      wsList.current.onopen = () => console.log("ChatList connection established!");
      wsList.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setChatList(data.data);
      };
    }
    return () => {
      if (wsList.current && wsList.current.readyState === WebSocket.OPEN) {
        wsList.current.close();
        wsList.current = null;
      }
    };
  }, [user]);

  const fetchChatList = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/chat/chatroom-list/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      setChatList(data);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  const getFirstLetter = (full_name) => full_name?.[0] || "";

  return (
    <div className="w-full md:w-[30rem] text-muted-foreground p-4 border overflow-y-auto h-[91vh]  md:h-[45rem] bg-muted/40">
      {/* Search Input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search"
          className="w-full p-2 bg-background text-sm md:text-base rounded"
        />
      </div>

      {/* Chat List */}
      {chatList &&
        chatList.map((chats) => (
          <Link
            onClick={handleOpen}
            to={`/messages/${chats.name}`}
            key={chats.name}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between py-4 px-2 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition">
                {/* User Info */}
                <div className="flex gap-3 items-center">
                  <Avatar>
                    <AvatarImage
                      src={chats.other_user?.profile_picture}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {getFirstLetter(chats?.other_user?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-sm md:text-base">
                      {chats.other_user.full_name}
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                      {chats.last_message}
                    </p>
                  </div>
                </div>

                {/* Unread Count & Timestamp */}
                <div className="flex flex-col items-center">
                  {chats.has_unread > 0 && (
                    <span className="text-xs px-2 bg-green-800 rounded-full text-white">
                      {chats.has_unread}
                    </span>
                  )}
                  <span className="text-xs md:text-sm text-muted-foreground">
                    09:40 AM
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default ChatList;
