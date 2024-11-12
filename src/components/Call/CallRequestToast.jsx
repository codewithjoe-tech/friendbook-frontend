import React from 'react';
import { Button } from '../ui/button';
import { PhoneCallIcon } from 'lucide-react';
import { Avatar ,AvatarImage, AvatarFallback} from '../ui/avatar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { acceptCall, declineCall } from '@/redux/Slices/CallSlice';
import { useEffect } from 'react';
import { useRef } from 'react';

const CallRequestToast = () => {
    
    const {incomingCall,ws,caller , isInCall} = useSelector(state=>state.call)
    const dispatch = useDispatch()
    const declineButton = useRef()
    const audioRef = useRef(new Audio('/callsend.mp3'))
    const handleAudioPlay = () => {
        audioRef.current.loop = true
        audioRef.current.play().catch((error) => {
            console.log('Audio playback failed:', error)
        })
    }
    useEffect(() => {
        handleAudioPlay()
      setTimeout(() => {
        if(incomingCall && !isInCall){
            declineButton.current.click()

        }
      }, 40000);
      return () => {
        audioRef.current.pause()
        audioRef.current = null
      }
    }, [incomingCall])
    
    return (
        <div className="flex items-center w-full max-w-xs p-4 mb-4 fixed top-10 right-7 z-50 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 text-green-500">
            <Avatar className="w-10 h-10">
                <AvatarImage src={incomingCall.callerImage} alt={`${incomingCall.from}'s profile`} />
                <AvatarFallback>{incomingCall.from.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ms-3 text-sm font-normal">
                <div>{incomingCall.from}</div>
                <div className="text-sm">Incoming call!</div>
            </div>
            <Button variant type="button" className="ml-auto text-green-500 hover:text-green-700" onClick={() => {
                ws.send(JSON.stringify({action:"accept_call",target_username:incomingCall.from}))
                dispatch(acceptCall())
                
            }}>
                <PhoneCallIcon />
            </Button>
            <Button variant type="button" ref={declineButton} className="ml-2 text-red-500 hover:text-red-700" onClick={() => {
                ws.send(JSON.stringify({action:"reject",target_username:incomingCall.from}))
                dispatch(declineCall())
                
                }}>
                <PhoneCallIcon />
            </Button>
        </div>
    );
};

export default CallRequestToast;
