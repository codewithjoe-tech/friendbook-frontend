import ChatArea from "@/components/Messages/ChatArea";
import ChatList from "@/components/Messages/ChatList";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu } from "lucide-react";
import { useState } from "react";


const ChatApp = () => {
    const [chatListOpen, setChatListOpen] = useState(false)
    const handleChatListOpen = () => {
        setChatListOpen(!chatListOpen)
    }
  return (
    <div className=" w-[70rem] mx-auto  flex items-center ">

{
    chatListOpen && 
    <ChatList />
}

    
    <ChatArea open={chatListOpen} handleOpen={handleChatListOpen} />
   
    </div>
  );
};

export default ChatApp;
