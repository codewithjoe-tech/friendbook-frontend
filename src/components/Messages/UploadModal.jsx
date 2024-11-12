import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { getCookie } from "@/utils";
import SmallSpinner from "../common/SmallSpinner";

const UploadModal = ({roomName , ws}) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)


  const sendWsMessage = (content_type, content) => {
    ws.current.send(JSON.stringify({
      "message_type": "file",
      content_type,
      content,
    }));
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const type = selectedFile.type.startsWith("image") ? "image" : "video";
      setFileType(type);
      setFile(selectedFile);
    }
  };
const access = getCookie("accessToken");
const handleUpload = async () => {
  setLoading(true);
  if (!file) return;

  const formData = new FormData();
  formData.append("chatroom", roomName);
  formData.append("content_type", fileType === "image" ? "imagemessage" : fileType === "video" ? "videomessage" : fileType === "audio" ? "audiomessage" : "textmessage");

  const fileField = fileType === "image" ? "image" : fileType === "video" ? "video" : "audio";
  if (fileType !== "text") formData.append(fileField, file); 

  try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/get-messages/`, {
          method: "POST",
          body: formData,
          headers: {
              "Authorization": `Bearer ${access}`, 
          },
      });

      const data = await response.json();
      if (response.ok) {
          console.log("Upload successful:", data);
          sendWsMessage(fileType === "image" ? "imagemessage" : fileType === "video" ? "videomessage" : fileType === "audio" ? "audiomessage" : "textmessage", data.id)
      } else {
          console.log("Upload failed:", data);
      }
  } catch (error) {
      console.log("Error during upload:", error);
  } finally {
      setIsModalOpen(false);
      setFile(null);
      setFileType("");
      setLoading(false)
  }
};

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} >
      <DialogTrigger asChild>
        <label className="mx-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <Paperclip />
        </label>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="file-input"
          />
          {file && (
            <div className="mt-4 flex justify-center items-center">
              {fileType === "image" ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className="max-w-full h-96 rounded" />
              ) : (
                <video controls src={URL.createObjectURL(file)} className="max-w-full h-96  rounded" />
              )}
            </div>
          )}
          <Button disabled={loading} className="" onClick={handleUpload}>
            {
          loading ? <><SmallSpinner /></> : 'Upload'
          }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
