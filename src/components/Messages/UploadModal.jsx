import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { getCookie } from "@/utils";
import SmallSpinner from "../common/SmallSpinner";
import { useEffect } from "react";

const UploadModal = ({ roomName, ws }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendWsMessage = (content_type, content) => {
    ws.current.send(JSON.stringify({
      message_type: "file",
      content_type,
      content,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const type = selectedFile.type.startsWith("image") ? "image" : "video";
      if (type === "video") {
        const videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(selectedFile);
        videoElement.onloadedmetadata = () => {
          if (videoElement.duration > 120) {
            setError("Video cannot exceed 2 minutes");
            return;
          }
          setError("");
          setFileType(type);
          setFile(selectedFile);
        };
      } else {
        setError("");
        setFileType(type);
        setFile(selectedFile);
      }
    }
  };

  const access = getCookie("accessToken");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("chatroom", roomName);
    formData.append("content_type", fileType === "image" ? "imagemessage" : "videomessage");

    const fileField = fileType === "image" ? "image" : "video";
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
        sendWsMessage(fileType === "image" ? "imagemessage" : "videomessage", data.id);
      } else {
        setError(`Upload failed: ${data.detail || "Unknown error"}`);
      }
    } catch (error) {
      setError("Error during upload");
    } finally {
      setIsModalOpen(false);
      setFile(null);
      setFileType("");
      setLoading(false);
    }
  };
  useEffect(() => {
    if(!isModalOpen){
      setFile(null)
      setFileType("")

    }
  
    
  }, [isModalOpen])
  

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
          {error && <p className="text-red-600">{error}</p>}
          {file && (
            <div className="mt-4 flex justify-center items-center">
              {fileType === "image" ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className="max-w-full h-96 rounded" />
              ) : (
                <video controls src={URL.createObjectURL(file)} className="max-w-full h-96 rounded" />
              )}
            </div>
          )}
          <Button disabled={loading || !!error} className="" onClick={handleUpload}>
            {loading ? <><SmallSpinner /></> : 'Upload'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
