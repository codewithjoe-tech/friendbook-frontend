import React, { useRef, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from 'react-redux';
import { endCall } from '@/redux/Slices/CallSlice';
import { getCookie } from '@/utils';

const CallModal = () => {
  const dispatch = useDispatch();
  const { isInCall, caller, receiver, ws } = useSelector((state) => state.call);
  const { user } = useSelector((state) => state.users);
  
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const access = getCookie('accessToken');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const iceCandidatesQueue = useRef([]);
  const callWs = useRef(null);
  const messageQueue = useRef([]);
  const endButtonRef = useRef();

  useEffect(() => {
    if (isInCall) {
      startVideoCall();
    }
    return () => {
      if (!isInCall) endVideoCall();
    };
  }, [isInCall]);

  const startVideoCall = async () => {
    callWs.current = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/ws/invideo/call/${user?.username}/?token=${access}`
    );

    callWs.current.onopen = () => {
      console.log("WebSocket connected");
      // Send queued messages
      while (messageQueue.current.length > 0) {
        callWs.current.send(messageQueue.current.shift());
      }
      // Send any pending ICE candidates
      while (iceCandidatesQueue.current.length > 0) {
        const candidate = iceCandidatesQueue.current.shift();
        sendIceCandidate(candidate);
      }
    };

    callWs.current.onmessage = (message) => handleSignalingData(JSON.parse(message.data));

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

    peerConnection.current.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        if (callWs.current.readyState === WebSocket.OPEN) {
          sendIceCandidate(event.candidate);
        } else {
          iceCandidatesQueue.current.push(event.candidate);
        }
      }
    };

    if (caller === user.username) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      sendMessage({
        action: 'offer',
        offer,
        target_username: receiver,
      });
    }
  };

  const sendMessage = (message) => {
    const serializedMessage = JSON.stringify(message);
    if (callWs.current && callWs.current.readyState === WebSocket.OPEN) {
      callWs.current.send(serializedMessage);
    } else {
      messageQueue.current.push(serializedMessage);
    }
  };

  const sendIceCandidate = (candidate) => {
    sendMessage({
      action: 'ice_candidate',
      type: 'ICE_CANDIDATE',
      candidate,
      target_username: caller ? caller : receiver,
    });
  };

  const handleSignalingData = async (data) => {
    try {
      if (data.type === 'OFFER') {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        sendMessage({ action: 'answer', answer, target_username: caller });

        while (iceCandidatesQueue.current.length > 0) {
          const candidate = iceCandidatesQueue.current.shift();
          await peerConnection.current.addIceCandidate(candidate);
        }

      } else if (data.type === 'ANSWER') {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));

        while (iceCandidatesQueue.current.length > 0) {
          const candidate = iceCandidatesQueue.current.shift();
          await peerConnection.current.addIceCandidate(candidate);
        }

      } else if (data.type === 'ICE_CANDIDATE') {
        const candidate = new RTCIceCandidate(data.candidate);
        if (peerConnection.current.remoteDescription) {
          await peerConnection.current.addIceCandidate(candidate);
        } else {
          iceCandidatesQueue.current.push(candidate);
        }

      } else if (data.type === 'END_CALL') {
        endButtonRef.current.click();
      }
    } catch (error) {
      console.error("Error handling signaling data:", error);
    }
  };

  const endVideoCall = () => {
    try {
      if (callWs.current && callWs.current.readyState === WebSocket.OPEN) {
        sendMessage({
          action: "end_call",
          type: "END_CALL",
          target_username: user?.username === caller ? receiver : caller,
        });
      }

      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        setRemoteStream(null);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
      }

      if (peerConnection.current) {
        peerConnection.current.ontrack = null;
        peerConnection.current.onicecandidate = null;
        peerConnection.current.close();
        peerConnection.current = null;
      }

      if (callWs.current) {
        callWs.current.onclose = () => console.log("WebSocket closed");
        callWs.current.close();
        callWs.current = null;
      }

      dispatch(endCall());
    } catch (error) {
      console.error("Error ending video call:", error);
    }
  };

  return (
    <Dialog open={isInCall}>
      <DialogContent className="flex flex-col items-center bg-gray-900 text-white p-6 rounded-lg">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-2xl font-semibold">
            Video Call with {caller ? receiver : caller}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            In a video call. Press "End Call" to disconnect.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <video ref={localVideoRef} autoPlay muted className="w-full max-w-sm h-48 rounded-lg border border-gray-700" />
          <video ref={remoteVideoRef} autoPlay className="w-full max-w-sm h-48 rounded-lg border border-gray-700" />
          <button ref={endButtonRef} onClick={endVideoCall} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            End Call
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallModal;
