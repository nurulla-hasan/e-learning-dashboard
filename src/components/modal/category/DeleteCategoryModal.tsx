import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import DeleteButton from "@/components/form/DeleteButton"
import { useDeleteCategoryMutation } from "@/redux/features/category/categoryApi"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

type TProps = {
  categoryId : string
}

const DeleteCategoryModal = ({ categoryId }: TProps) => {
  const [open, setOpen] = useState(false)
  const [deleteCategory, { isLoading, isSuccess }] = useDeleteCategoryMutation();
  const { t } = useTranslation("common");

  useEffect(() => {
    if (!isLoading) {
      setOpen(false);
    }
  }, [isLoading, isSuccess]);

  const handleClick = () =>  {
    deleteCategory(categoryId)
  }

  return (
    <>
      <Button
        onClick={() =>setOpen(true)}
        size="icon"
        className="bg-red-600 hover:bg-red-700"
      >
        <Trash2/>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("common:categories.modals.delete.title")}</DialogTitle>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button variant="default" className="bg-black hover:bg-black/80" onClick={() => setOpen(false)}>
              {t("common:categories.modals.delete.cancel")}
            </Button>
           <DeleteButton onClick={handleClick} isLoading={isLoading} label={t("common:categories.modals.delete.confirm")} loadingLabel={t("modals.delete.loading")} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DeleteCategoryModal