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

const DeleteTestModal = ({ testId }: { testId: string }) => {
  const [open, setOpen] = useState(false);
  const [deleteTest, { isLoading: deleteLoading }] =
    useDeleteTestMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTest(id).unwrap();
      setOpen(false);
      SuccessToast("Test deleted successfully");
    } catch (error) {
      console.log(error);
      ErrorToast("Failed to delete test");
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
            <DialogTitle>Are you sure, you want to delete this test?</DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="default"
              className="bg-black hover:bg-black/80"
              onClick={() => setOpen(false)}
            >
              No
            </Button>
            <Button
              disabled={deleteLoading}
              variant="destructive"
              onClick={() => handleDelete(testId)}
            >
              {deleteLoading ? "Deleting..." : "Yes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteTestModal;
