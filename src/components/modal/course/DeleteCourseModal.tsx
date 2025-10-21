"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Trash2 } from "lucide-react"

const DeleteCourseModal = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="bg-red-600 hover:bg-red-700 text-white rounded-md"
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Are you sure, you want to delete?</DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="default" className="bg-black hover:bg-black/80" onClick={() => setOpen(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={() => {
              // handle block action
              setOpen(false)
            }}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DeleteCourseModal