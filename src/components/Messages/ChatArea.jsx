import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Menu, X, Phone, Video, SendHorizonal, Check, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { formatTimestamp, getCookie } from "@/utils";
import { useSelector } from "react-redux";
import { Mic } from "lucide-react";
import { Link } from "react-router-dom";
import UploadModal from "./UploadModal";
import { useDispatch } from "react-redux";
import { startCall } from "@/redux/Slices/CallSlice";


const ChatArea = ({ open, handleOpen }) => {
  const [isChatRoom, setIsChatRoom] = useState(false);
  const [chatRoom, setChatRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const seenWs = useRef(null)
  const callWs = useSelector((state) => state.call.ws);
  const dispatch = useDispatch()
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageId: null });
  const contextMenuRef = useRef(null);


  const handleContextMenu = (e, messageId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, messageId });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleUnsend = () => {
    const messageId = contextMenu.messageId;
    if (messageId && ws.current) {
      ws.current.send(JSON.stringify({ message_type: "delete", content: messageId }));
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
      closeContextMenu();
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        closeContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const { user } = useSelector((state) => state.users);
  const { roomName } = useParams();
  const access = getCookie("accessToken");

  const fetchMessages = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/chat/get-messages/${roomName}`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    const data = await response.json();
    console.log(data)
    if (response.ok) {
      setMessages(data);
      console.log(data)
    }
  };

  const fetchChatList = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/chat/chat-room/specific/${roomName}`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      setChatRoom(data);
      console.log(data)
    }
  };

  useEffect(() => {
    if (roomName) {
      setIsChatRoom(true);
      fetchChatList();
      fetchMessages();

      if (!ws.current) {
        ws.current = new WebSocket(
          `${import.meta.env.VITE_WS_URL}/ws/chat/${roomName}/?token=${access}`
        );

        ws.current.onopen = () => {
          console.log("WebSocket for chat connected!");
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log(data)
          if(data.type=='delete_message'){
            console.log('deleting message')
            setMessages(prevMessages => prevMessages.filter((message)=>message.id!=data.message_id))
          }else{

            setMessages((prevMessages) => [...prevMessages, data]);
          }
        };

        ws.current.onclose = () => {
          console.log("WebSocket for chat disconnected");
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket error: ", error);
        };
      }

      return () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.close();
          ws.current = null;
        }
      };
    } else {
      setIsChatRoom(false);
    }
  }, [roomName]);


  useEffect(() => {
    const openSeenWebSocket = () => {
      if (!seenWs.current || seenWs.current.readyState === WebSocket.CLOSED) {
        seenWs.current = new WebSocket(
          `${import.meta.env.VITE_WS_URL}/ws/chat/seen/${roomName}/?token=${access}`
        );
  
        seenWs.current.onopen = () => {
          console.log("WebSocket for seen connected!");
        };
  
        seenWs.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const seenIds = data.seen_message_ids;
          setMessages((prevMessages) =>
            prevMessages.map((message) =>
              seenIds.includes(message.id) ? { ...message, seen: true } : message
            )
          );
        };
  
        seenWs.current.onclose = () => {
          console.log("WebSocket for seen disconnected");
        };
  
        seenWs.current.onerror = (error) => {
          console.error("WebSocket error: ", error);
        };
      }
    };
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && roomName) {
        openSeenWebSocket();
      } else if (seenWs.current && seenWs.current.readyState === WebSocket.OPEN) {
        seenWs.current.close();
        seenWs.current = null;
        console.log("WebSocket for seen closed due to tab visibility change");
      }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
  if(roomName) openSeenWebSocket();
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (seenWs.current && seenWs.current.readyState === WebSocket.OPEN) {
        seenWs.current.close();
      }
    };
  }, [roomName, access]);
  


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() !== "" && ws.current) {
      const messageData = {
        content_type: "textmessage",
        content: {
          text: newMessage,
        },
      };

      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(messageData));
        setNewMessage("");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const get_letter = (full_name) => {
    const lis = full_name.split(" ");
    if (lis.length > 1) {
      return lis[0][0].toUpperCase() + lis[1][0].toUpperCase();
    }
    return full_name[0];
  };


  const VideoCall = (target_username) => {
    if (callWs.readyState === WebSocket.OPEN) {

      callWs.send(JSON.stringify({ action: "call_request", target_username }));
      dispatch(startCall({
        caller: user?.username,
        callerProfile: chatRoom?.other_user?.profile_picture,
        receiver: chatRoom?.other_user?.username
      }));



    }
  }

  return (
    <>
      {isChatRoom ? (
        <div className="w-full flex flex-col bg-background h-[45rem] border">
          <div className="flex items-center justify-between p-4 bg-muted ">
            <div className="flex items-center space-x-4">
              {!open ? (
                <Menu className="cursor-pointer" onClick={handleOpen} />
              ) : (
                <X className="cursor-pointer" onClick={handleOpen} />
              )}
              <Avatar>
                <AvatarImage
                  src={chatRoom?.other_user?.profile_picture}
                  className="object-cover "
                />
                <AvatarFallback className="bg-muted-foreground/40">
                  {get_letter(chatRoom?.other_user?.full_name || "")}
                </AvatarFallback>
              </Avatar>

              <div>
                <h4 className="font-semibold text-muted-foreground">
                  {chatRoom?.other_user?.full_name}
                </h4>
                <p className="text-sm text-muted-foreground/60">
                  @{chatRoom?.other_user?.username}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">

              <Button onClick={() => { VideoCall(chatRoom?.other_user?.username) }} className="text-muted-foreground bg-background/30">
                <Video />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {messages &&
              messages.map((message, index) => (
                <div key={index}>
                  {message.sender !== user.username ? (
                    <div className="flex space-x-4 items-center">
                      <Link to={`/profile/${message.sender}`}>
                        <Avatar>
                          <AvatarImage className="object-cover" src={message?.profile_picture} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </Link>

                      <div>
                        <div
                          className={`p-4 rounded-lg shadow mt-4 ${message.seen ? "bg-muted/60" : "bg-muted/30"
                            }`}
                        >
                          {message.content_type === "textmessage" && (
                            <p className="text-muted-foreground">
                              {message?.content_object?.text}
                            </p>
                          )}
                          {message.content_type === "imagemessage" && (
                            <img
                              src={message?.content_object?.image}
                              alt="Image"
                              className="max-w-xs"
                            />
                          )}
                          {message.content_type === "videomessage" && (
                            <video
                              controls
                              src={message?.content_object?.video}
                              className="max-w-xs"
                            />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground/60">
                          {formatTimestamp(message?.timestamp)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div

                        className="flex justify-end space-x-4 items-center">
                        <div className="flex flex-col space-y-2 items-end">
                          <div  onContextMenu={(e) => message.sender === user.username && handleContextMenu(e, message.id)}
                            className={`p-4 rounded-lg shadow relative ${message.seen ? "bg-blue-500/60" : "bg-blue-700"
                              }`}
                          >
                            {message.content_type === "textmessage" && (
                              <p className="text-muted-foreground">
                                {message?.content_object?.text}
                              </p>
                            )}
                            {message.content_type === "imagemessage" && (
                              <img
                                src={message?.content_object?.image}
                                alt="Image"
                                className="max-w-xs"
                              />
                            )}
                            {message.content_type === "videomessage" && (
                              <video
                                controls
                                src={message?.content_object?.video}
                                className="max-w-xs"
                              />
                            )}


                            <div className=" ">
                              {message.seen && (
                                <>
                                  <Check className="absolute bottom-0 right-2 text-white" size={16} />
                                  <Check className="absolute bottom-0 right-3 text-white" size={16} />
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground/60">
                              {formatTimestamp(message?.timestamp)}
                            </span>
                          </div>
                        </div>
                        <Avatar>
                          <AvatarImage className="object-cover" src={message?.profile_picture} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        {contextMenu.visible && (
                          <div
                            ref={contextMenuRef}
                            style={{ top: contextMenu.y, left: contextMenu.x }}
                            className="absolute bg-background hover:bg-muted shadow-md rounded p-2 z-10"
                          >
                            <button className="text-red-500" onClick={handleUnsend}>Unsend</button>
                          </div>
                        )}


                      </div>


                    </>

                  )}
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex p-4 bg-muted items-center">
            <Input
              className="w-full p-2 bg-background/30 text-muted-foreground rounded"
              placeholder="Write your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <label className="mx-2 cursor-pointer">
              <UploadModal roomName={roomName} ws={ws} />
            </label>

            <Button
              className="ml-2 bg-muted/30 text-muted-foreground"
              onClick={sendMessage}
            >
              <SendHorizonal />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col bg-background h-[45rem] border ">
          {!open ? (
            <Menu className="cursor-pointer mt-6 mx-4" onClick={handleOpen} />
          ) : (
            <X className="cursor-pointer mt-6 mx-4" onClick={handleOpen} />
          )}
          <div className="flex items-center justify-center h-full p-4  ">
            <div className="flex items-center space-x-4">
              <h2 className="font-semibold text-muted-foreground/50">
                Chat with your friends
              </h2>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default ChatArea;