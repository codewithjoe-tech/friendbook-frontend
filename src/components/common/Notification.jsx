import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react'
import { useEffect } from 'react'
import { getCookie } from '@/utils'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'



const Notification = ({ open, onClose }) => {

 





  

  return (
    <Sheet open={open} onOpenChange={onClose} >
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Notification</SheetTitle>
          <SheetDescription>
            
          </SheetDescription>
        </SheetHeader>

        <div>
         
              <p className='text-center mt-10 text-muted-foreground/50'>No Notification</p>
            
          
        </div>
      </SheetContent>
    </Sheet>

  )
}

export default Notification