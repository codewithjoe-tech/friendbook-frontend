import ChatArea from "@/components/Messages/ChatArea";
import ChatList from "@/components/Messages/ChatList";
import { useState } from "react";

const ChatApp = () => {
  const [chatListOpen, setChatListOpen] = useState(true);

  const handleChatListOpen = () => {
    setChatListOpen(!chatListOpen);
  };

  return (
    <div className="relative md:mt-24 w-full md:w-[70rem] mx-auto flex md:flex-row flex-col items-center">
      
      <div
        className={`md:${!chatListOpen && 'hidden'} absolute md:relative bg-background z-20 w-full md:w-[30rem] transition-all duration-300 ${
          chatListOpen
            ? "top-0 left-0 h-full md:translate-x-0 translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <ChatList handleOpen={handleChatListOpen} />
      </div>

      {/* ChatArea */}
      <div
        className={`flex-1 w-full h-full transition-opacity duration-300 ${
          chatListOpen ? "opacity-0 md:opacity-100" : "opacity-100"
        } md:relative`}
      >
        <ChatArea open={chatListOpen} handleOpen={handleChatListOpen} />
      </div>
    </div>
  );
};

export default ChatApp;
