import React from 'react'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Menu } from 'lucide-react'
import { Cross } from 'lucide-react'
import { X } from 'lucide-react'

const ChatArea = ({open , handleOpen}) => {
  return (
    <div className="w-full flex flex-col bg-background h-[45rem] border ">
    {/* Chat Header */}
    <div className="flex items-center justify-between p-4 bg-muted ">
      <div className="flex items-center space-x-4">
      {
        !open ?
        <Menu className='cursor-pointer' onClick={handleOpen}/> :(
            <X className='cursor-pointer' onClick={handleOpen}/>
        )}
        <Avatar src="https://example.com/avatar3.png" className="w-12 h-12" />
        <div>
          <h4 className="font-semibold text-muted-foreground">Monroe Parker</h4>
          <p className="text-sm text-muted-foreground/60">@Monroepark</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button className="text-muted-foreground bg-background/30">Call</Button>
        <Button className="text-muted-foreground bg-background/30">Video</Button>
      </div>
    </div>

    {/* Chat Messages */}
    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
      {/* Message From Another User (Left-aligned) */}
      <div className="flex space-x-4">
        <Avatar src="https://example.com/avatar-john.png" className="w-10 h-10" />
        <div>
          <div className="bg-muted/30 p-4 rounded-lg shadow">
            <p className="text-muted-foreground">Hi, I'm John</p>
          </div>
          <span className="text-xs text-muted-foreground/60">April 8, 2023, 6:30 AM</span>
        </div>
      </div>

      {/* Message from Monroe (Left-aligned) */}
      <div className="flex space-x-4">
        <Avatar src="https://example.com/avatar-monroe.png" className="w-10 h-10" />
        <div>
          <div className="bg-muted/30 p-4 rounded-lg shadow">
            <p className="text-muted-foreground">I'm Lisa. Welcome John</p>
          </div>
          <span className="text-xs text-muted-foreground/60">April 8, 2023, 6:31 AM</span>
        </div>
      </div>

      {/* Message from Sender (Right-aligned) */}
      <div className="flex justify-end space-x-4">
        <div className="bg-background/30 p-4 rounded-lg shadow">
          <p className="text-muted-foreground">Wow, it's beautiful. How much? 😍</p>
        </div>
        <Avatar src="https://example.com/avatar-sender.png" className="w-10 h-10" />
      </div>

      {/* Image message (Right-aligned) */}
      <div className="flex justify-end space-x-4">
        <div className="bg-background/30 p-4 rounded-lg shadow">
          <p className="text-muted-foreground">I'm selling a photo of a sunset...</p>
          <img src="https://example.com/photo.jpg" alt="Photo" className="mt-2 rounded-lg" />
        </div>
        <Avatar src="https://example.com/avatar-sender.png" className="w-10 h-10" />
      </div>
    </div>

    {/* Input Area */}
    <div className="flex p-4 bg-muted">
      <Input
        className="w-full p-2 bg-background/30 text-muted-foreground rounded"
        placeholder="Write your message"
      />
      <Button className="ml-2 bg-muted/30 text-muted-foreground">Send</Button>
    </div>
  </div>
  )
}

export default ChatArea