
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
import { useTranslation } from "react-i18next"

type TProps = {
  subscriberId : string;
}

const DeleteSubscriberModal = ({ subscriberId }: TProps) => {
  const { t } = useTranslation("common")
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
            <DialogTitle>{t("subscribers.modal.delete.title")}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              {t("subscribers.modal.delete.cancel")}
            </Button>
            <DeleteButton
              onClick={handleClick}
              isLoading={isLoading}
              label={t("subscribers.modal.delete.confirm")}
              loadingLabel={t("subscribers.modal.delete.loading")}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DeleteSubscriberModal