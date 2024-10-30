import React from 'react';
import { Button } from '../ui/button';
import { PhoneCallIcon } from 'lucide-react';
import { Avatar ,AvatarImage, AvatarFallback} from '../ui/avatar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { declineCall } from '@/redux/Slices/CallSlice';
import { useEffect } from 'react';

const StartCalling = () => {
    
    const {receiver , isCallingProfile,ws} = useSelector(state=>state.call)
    const dispatch = useDispatch()


    useEffect(() => {
      console.log(receiver)
    }, [receiver])
    
    return (
        <div className="flex items-center justify-between w-full max-w-xs p-4 mb-4 fixed top-10 right-7 z-50 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 text-green-500">
            <Avatar className="w-10 h-10">
                <AvatarImage src={isCallingProfile || ''} alt={`${receiver|| "unknown"}'s profile`} />
                <AvatarFallback>{"joe".charAt(0) || ""}</AvatarFallback>
            </Avatar>
            <div className="ms-3 text-sm font-normal">
                <div>{receiver}</div>
                <div className="text-sm">Calling</div>
            </div>
            
            <Button variant type="button" className="ml-2 text-red-500 hover:text-red-700" onClick={() => {
                ws.send(JSON.stringify({action:"abandon_call",target_username:receiver}))
                dispatch(declineCall())
                
                }}>
                <PhoneCallIcon />
            </Button>
        </div>
    );
};

export default StartCalling;
