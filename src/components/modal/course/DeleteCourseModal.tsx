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
import { useDeleteCourseMutation } from "@/redux/features/course/courseApi";
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper";
import { useTranslation } from "react-i18next";

const DeleteCourseModal = ({ courseId }: { courseId: string }) => {
  const [open, setOpen] = useState(false);
  const [deleteCourse, { isLoading: deleteLoading }] =
    useDeleteCourseMutation();
  const { t } = useTranslation("common");

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id).unwrap();
      setOpen(false);
      SuccessToast(t("common:courses.notifications.deleteSuccess"));
    } catch (error) {
      console.log(error);
      ErrorToast(t("common:courses.notifications.deleteError"));
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
            <DialogTitle>{t("common:courses.modals.delete.title")}</DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="default"
              className="bg-black hover:bg-black/80"
              onClick={() => setOpen(false)}
            >
              {t("common:courses.modals.delete.cancel")}
            </Button>
            <Button
              disabled={deleteLoading}
              variant="destructive"
              onClick={() => {
                handleDelete(courseId);
              }}
            >
              {deleteLoading
                ? t("common:courses.modals.delete.loading")
                : t("common:courses.modals.delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteCourseModal;
