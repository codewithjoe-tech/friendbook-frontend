import React from 'react'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const ChatList = () => {
  return (
    <div className="w-[30rem] text-muted-foreground p-4 border overflow-y-auto h-[45rem] bg-muted/40">
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search"
      />
    </div>
 
    <div className="space-y-4 ">
   
      <div className="flex items-center gap-3 justify-between py-4 px-2 bg-muted/30 rounded-lg cursor-pointer">
      <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

        <div className='flex flex-col '>
          <h4 className="font-semibold">Jesse Steeve</h4>
          <p className="text-sm text-muted-foreground">Love your photos 😍</p>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">09:40AM</span>
      </div>
     
      
    </div>
  </div>
  )
}

export default ChatList