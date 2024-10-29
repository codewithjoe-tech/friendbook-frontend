import { RouteChangeHandler } from '@/App'
import Authenticate from '@/authenticate'
import CallRequestToast from '@/components/Call/CallRequestToast'
import Sidebar from '@/components/common/Sidebar'
import Toast from '@/components/common/Toast'
import UploadModal from '@/components/common/UploadModal'
import { receiveCallRequest, setWebSocket, closeWebSocket } from '@/redux/Slices/CallSlice'
import { setModalOpen } from '@/redux/Slices/PostSlice'
import { getCookie } from '@/utils'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    const postModalOpen = useSelector((state) => state.post.postModalOpen)
    const dispatch = useDispatch()
    const ws = useRef(null)
    const access = getCookie('accessToken')
    const { user } = useSelector((state) => state.users)
    const call = useSelector((state) => state.call)
    const audioRef = useRef(new Audio('/callsound.wav'))

    const handleAudioPlay = () => {
        audioRef.current.loop = true
        audioRef.current.play().catch((error) => {
            console.log('Audio playback failed:', error)
        })
    }

    const handleAudioStop = () => {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
    }

    useEffect(() => {
        ws.current = new WebSocket(
            `${import.meta.env.VITE_WS_URL}/ws/call/notification/${user?.username}/?token=${access}`
        )

        ws.current.onopen = () => {
            console.log("WebSocket connected! to notification")
        }

        ws.current.onclose = () => {
            console.log("notification disconnected")
        }

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.type === 'CALL_REQUEST' && data.from !== user?.username) {
                console.log(data)
                dispatch(receiveCallRequest({ from: data.from, callerImage: data.profile_picture }))
                handleAudioPlay()
            }
        }

        dispatch(setWebSocket(ws.current))

        return () => {
            dispatch(closeWebSocket())  
        }
    }, [access, user?.username, dispatch])

    useEffect(() => {
        if (!call.incomingCall) {
            handleAudioStop()
        }
    }, [call.incomingCall])

    return (
        <>
            <RouteChangeHandler />
            <Authenticate>
                <Toast />
                {call.incomingCall && <CallRequestToast />}
                <div className="flex gap-16 ">
                    <div className="basis-14">
                        <Sidebar />
                    </div>
                    {postModalOpen && <UploadModal isOpen={postModalOpen} onClose={() => { dispatch(setModalOpen()) }} />}
                    <Outlet />
                </div>
            </Authenticate>
        </>
    )
}

export default MainLayout
