import React from 'react';
import { Button } from '../ui/button';
import { PhoneCallIcon } from 'lucide-react';
import { Avatar ,AvatarImage, AvatarFallback} from '../ui/avatar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { declineCall } from '@/redux/Slices/CallSlice';

const CallRequestToast = () => {
    
    const {incomingCall} = useSelector(state=>state.call)
    const dispatch = useDispatch()
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
            <Button variant type="button" className="ml-auto text-green-500 hover:text-green-700" onClick={() => {}}>
                <PhoneCallIcon />
            </Button>
            <Button variant type="button" className="ml-2 text-red-500 hover:text-red-700" onClick={() => {dispatch(declineCall())}}>
                <PhoneCallIcon />
            </Button>
        </div>
    );
};

export default CallRequestToast;
