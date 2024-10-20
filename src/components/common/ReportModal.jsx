import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
  

const ReportModal = ({open , onClose,handleReportValueChange , submitReport,reportReason}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
  
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action is irreplaceable and we will closely look into your report
      </DialogDescription>
    </DialogHeader>
    <Label className="font-bold">Reason</Label>
    <Input onChange={handleReportValueChange} value={reportReason}  />
   <div className="flex gap-3">
     
   <Button onClick={submitReport} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Submit</Button>
    <Button onClick={onClose} size="sm">Cancel</Button>
   </div>
  </DialogContent>
</Dialog>

  )
}

export default ReportModal