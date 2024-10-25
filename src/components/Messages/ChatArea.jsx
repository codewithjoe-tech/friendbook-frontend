import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Menu, X, Phone, Video, SendHorizonal, Check, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { getCookie } from "@/utils";
import { useSelector } from "react-redux";

const ChatArea = ({ open, handleOpen }) => {
  const [isChatRoom, setIsChatRoom] = useState(false);
  const [chatRoom, setChatRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

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
    if (response.ok) {
      setMessages(data);
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
    }
  };

  useEffect(() => {
    if (roomName) {
      setIsChatRoom(true);
      fetchChatList();
      fetchMessages();

      if (!ws.current) {
        ws.current = new WebSocket(
          `ws://127.0.0.1:8000/ws/chat/${roomName}/?token=${access}`
        );

        ws.current.onopen = () => {
          console.log("WebSocket for chat connected!");
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, data]);
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
        }
      };
    } else {
      setIsChatRoom(false);
    }
  }, [roomName]);

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

  const sendFileMessage = async (file) => {
    let contentType;
  
    // Determine content type based on file type
    if (file.type.startsWith("image/")) {
      contentType = "imagemessage";
    } else if (file.type.startsWith("video/")) {
      contentType = "videomessage";
    } else {
      alert("Unsupported file type. Please upload an image or video.");
      return;
    }
  
    // Verify WebSocket connection and file type
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const reader = new FileReader();
  
      // Read the file as base64
      reader.onload = (e) => {
        const base64Data = e.target.result.split(",")[1]; // Get the base64 data without the "data:image/png;base64," part
  
        const messageData = {
          content_type: contentType,
          content: {
            file: base64Data,  // Base64 encoded file data
            filename: file.name,
            file_type: file.type // The MIME type of the file
          },
        };
  
        // Send the message to the WebSocket
        ws.current.send(JSON.stringify(messageData));
        setSelectedFile(null);
      };
  
      reader.onerror = (error) => {
        console.error("File reading error:", error);
        alert("Failed to read the file.");
      };
  
      // Start reading the file as Data URL (base64)
      reader.readAsDataURL(file);
    } else {
      console.error("WebSocket is not open or file type is not supported.");
    }
  };
  
  

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      sendFileMessage(file);
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
              <Button className="text-muted-foreground bg-background/30">
                <Phone />
              </Button>
              <Button className="text-muted-foreground bg-background/30">
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
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <div>
                        <div
                          className={`p-4 rounded-lg shadow mt-4 ${
                            message.seen ? "bg-muted/60" : "bg-muted/30"
                          }`}
                        >
                          {message.content_type === "textmessage" && (
                            <p className="text-muted-foreground">
                              {message?.content_object?.text}
                            </p>
                          )}
                          {message.content_type === "imagemessage" && (
                            <img
                              src={`data:image/*;base64,${message?.content_object?.file}`}
                              alt="Image"
                              className="max-w-xs"
                            />
                          )}
                          {message.content_type === "videomessage" && (
                            <video
                              controls
                              src={`data:video/*;base64,${message?.content_object?.file}`}
                              className="max-w-xs"
                            />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground/60">
                          April 8, 2023, 6:30 AM
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-4 items-center">
                      <div
                        className={`p-4 rounded-lg shadow relative ${
                          message.seen ? "bg-blue-500/60" : "bg-blue-700"
                        }`}
                      >
                        {message.content_type === "textmessage" && (
                          <p className="text-muted-foreground">
                            {message?.content_object?.text}
                          </p>
                        )}
                        {message.content_type === "imagemessage" && (
                          <img
                            src={`data:image/*;base64,${message?.content_object?.file}`}
                            alt="Image"
                            className="max-w-xs"
                          />
                        )}
                        {message.content_type === "videomessage" && (
                          <video
                            controls
                            src={`data:video/*;base64,${message?.content_object?.file}`}
                            className="max-w-xs"
                          />
                        )}
                        {message.seen && (
                          <Check className="absolute bottom-2 right-2 text-muted-foreground" size={16} />
                        )}
                      </div>
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex p-4 bg-muted">
            <Input
              className="w-full p-2 bg-background/30 text-muted-foreground rounded"
              placeholder="Write your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <label className="ml-2 cursor-pointer">
              <Paperclip />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
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
