import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import type z from "zod";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { useCreateFaqMutation } from "@/redux/features/faq/faqApi";
import { faqSchema } from "@/schema/faq.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { SetCreateFaqError } from "@/redux/features/faq/faqSlice";
import CustomTextArea from "@/components/form/CustomTextArea";
import FormButton from "@/components/form/FormButton";
import ErrorAlert from "@/components/validation/ErrorAlert";

type FormValues = z.infer<typeof faqSchema>;

const CreateFaqModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { CreateFaqError } = useAppSelector((state) => state.faq);
  const [createFaq, { isLoading, isSuccess }] = useCreateFaqMutation();
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(faqSchema),
  });

  useEffect(() => {
    if (isSuccess) {
      reset();
      setModalOpen(false);
    }
  }, [isSuccess, reset, dispatch]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(SetCreateFaqError(""));
    createFaq(data);
  };



  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-cyan-500 text-white cursor-pointer px-6 py-1 rounded hover:bg-cyan-600 transition"
      >
        + Add FAQ
      </button>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0" onInteractOutside={(e) => e.preventDefault()} showCloseButton={false}>
          <DialogHeader className="px-6 py-4 pb-2">
            <DialogTitle className="text-lg font-semibold text-center">Add FAQ</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
            {CreateFaqError && <ErrorAlert message={CreateFaqError} />}
            <CustomTextArea label="Question" name="question" control={control} placeholder="write a question..." rows={3} />
            <CustomTextArea label="Answer" name="answer" control={control} placeholder="write an answer..." rows={3} />
            <div className="flex gap-3 pt-2">
              <Button type="button" onClick={() => setModalOpen(false)} variant="outline" className="w-1/2 bg-transparent">
                Cancel
              </Button>
              <div className="w-1/2">
                <FormButton isLoading={isLoading} loadingTitle="Adding...">Add</FormButton>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateFaqModal;
