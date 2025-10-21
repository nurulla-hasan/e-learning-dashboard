"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { FiTrash2 } from "react-icons/fi";
import { useDeleteFaqMutation } from "@/redux/features/faq/faqApi";
import DeleteButton from "@/components/form/DeleteButton";

type TProps = {
  faqId: string;
}

const DeleteFaqModal = ({ faqId }: TProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteFaq, { isLoading, isSuccess }] = useDeleteFaqMutation();
  
  useEffect(() => {
    if (!isLoading) {
      setModalOpen(false);
    }
  }, [isLoading, isSuccess]);

  const handleClick = () => {
    deleteFaq(faqId)
  }


  return (
    <>
     <button onClick={()=> setModalOpen(true)} className="bg-white p-1.5 cursor-pointer rounded-full shadow hover:bg-gray-100 transition">
        <FiTrash2 className="text-red-500" size={20} />
      </button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Are you sure, you want to delete?</DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="default" className="bg-black hover:bg-black/80" onClick={() => setModalOpen(false)}>
              No
            </Button>
           <DeleteButton onClick={handleClick} isLoading={isLoading}/>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DeleteFaqModal