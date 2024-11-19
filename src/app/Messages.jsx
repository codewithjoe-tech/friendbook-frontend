import ChatArea from "@/components/Messages/ChatArea";
import ChatList from "@/components/Messages/ChatList";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChatApp = () => {
  const [chatListOpen, setChatListOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { roomName } = useParams();

  useEffect(() => {
    if (roomName) {
      setChatListOpen(false);
    }
  }, [roomName]);

  const handleChatListOpen = () => {
    if (chatListOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setChatListOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setChatListOpen(true);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="relative md:mt-24 w-full md:w-[70rem] mx-auto flex md:flex-row flex-col items-stretch">
      {/* ChatList */}
      {(chatListOpen || isAnimating) && (
        <div
          className={`md:relative bg-background z-20 w-full md:w-[30rem] h-full transition-all duration-300 ${
            chatListOpen
              ? "translate-x-0"
              : "translate-x-[-100%] md:translate-x-0"
          }`}
        >
          <ChatList handleOpen={handleChatListOpen} />
        </div>
      )}

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
