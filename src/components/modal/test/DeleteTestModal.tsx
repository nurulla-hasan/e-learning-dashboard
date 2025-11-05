"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDeleteTestMutation } from "@/redux/features/test/testApi";
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper";
import { useTranslation } from "react-i18next";

const DeleteTestModal = ({ testId }: { testId: string }) => {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [deleteTest, { isLoading: deleteLoading }] =
    useDeleteTestMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTest(id).unwrap();
      setOpen(false);
      SuccessToast(t("common:tests.notifications.deleteSuccess"));
    } catch (error) {
      console.log(error);
      ErrorToast(t("common:tests.notifications.deleteError"));
    }
  };

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
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>{t("common:tests.modals.delete.title")}</DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="default"
              className="bg-black hover:bg-black/80"
              onClick={() => setOpen(false)}
            >
              {t("common:tests.modals.delete.cancel")}
            </Button>
            <Button
              disabled={deleteLoading}
              variant="destructive"
              onClick={() => handleDelete(testId)}
            >
              {deleteLoading
                ? t("common:tests.modals.delete.loading")
                : t("common:tests.modals.delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteTestModal;
