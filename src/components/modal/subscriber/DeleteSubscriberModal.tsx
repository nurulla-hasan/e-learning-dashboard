
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import DeleteButton from "@/components/form/DeleteButton"
import { useEffect, useState } from "react"
import { useDeleteSubscriberMutation } from "@/redux/features/newsletter/newsletterApi"

type TProps = {
  subscriberId : string;
}

const DeleteSubscriberModal = ({ subscriberId }: TProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteSubscriber, { isLoading, isSuccess }] = useDeleteSubscriberMutation();

  useEffect(() => {
    if (!isLoading) {
      setModalOpen(false);
    }
  }, [isLoading, isSuccess]);

  const handleClick = () =>  {
    deleteSubscriber(subscriberId)
  }


  return (
    <>
      <Button
        onClick={() =>setModalOpen(true)}
        size="icon"
        className="bg-red-600 hover:bg-red-700 text-white rounded-md"
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Are you sure, you want to delete?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="default" className="bg-black hover:bg-black/80" onClick={() => setModalOpen(false)}>
              No
            </Button>
            <DeleteButton onClick={handleClick} isLoading={isLoading} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DeleteSubscriberModal