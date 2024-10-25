import React from 'react'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from 'react'
import { useEffect } from 'react'
import { getCookie } from '@/utils'
import { Link } from 'react-router-dom'


const ChatList = () => {

  const [chatList, setChatList] = useState([])
  const access = getCookie('accessToken')


  const fetchChatList = async ()=>{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/chatroom-list/`,{
      headers: {
        'Authorization': `Bearer ${access}`
      }
    })
    const data = await response.json()
    if(response.ok){
      setChatList(data)
     
    }
  }

  useEffect(() => {
    fetchChatList()
  }, [])



  const getFirstLetter = (full_name)=>{
    return full_name[0] ||  ""
  }
  

  return (
    <div className="w-[30rem] text-muted-foreground p-4 border overflow-y-auto h-[45rem] bg-muted/40">
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search"
      />
    </div>
 
 {
  chatList && chatList.map((chats)=>(
 <Link to={`/messages/${chats.name}`} key={chats.name}>
    <div className="space-y-2 " >
   
   <div className="flex items-center justify-between py-4 px-2 bg-muted/30 rounded-lg cursor-pointer">

     <div className='flex  gap-3 '>
   <Avatar>
<AvatarImage src={chats.other_user?.profile_picture} className="object-cover" />
<AvatarFallback>{
getFirstLetter(chats?.other_user?.full_name)
}</AvatarFallback>
</Avatar>
    <div className="flex flex-col">
    <h4 className="font-semibold">{chats.other_user.full_name}</h4>
       <p className="text-sm text-muted-foreground">{chats.last_message}</p>
     </div>
    </div>
     <div className='flex flex-col items-center'>
    {chats.has_unread > 0 && (
      <span className="text-xs text-muted-foreground px-2 bg-green-800 rounded-full text-white">
        {chats.has_unread}
      </span>
    )}
    <span className="ml-auto text-xs text-muted-foreground">09:40 AM</span>
    
  </div>
   </div>
  
   
 </div>
 </Link>
  ))

 }
  </div>
  )
}

export default ChatList