import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import type { IFaq } from "@/types/faq.type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { useUpdateFaqMutation } from "@/redux/features/faq/faqApi";
import { useForm, type SubmitHandler } from "react-hook-form";
import { faqSchema } from "@/schema/faq.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorAlert from "@/components/validation/ErrorAlert";
import CustomTextArea from "@/components/form/CustomTextArea";
import FormButton from "@/components/form/FormButton";
import type z from "zod";
import { SetEditFaqError } from "@/redux/features/faq/faqSlice";
import { useTranslation } from "react-i18next";

type FormValues = z.infer<typeof faqSchema>;

type TProps = {
  faq: IFaq
}

const EditFaqModal = ({ faq }: TProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { EditFaqError } = useAppSelector((state) => state.faq);
  const [updateFaq, { isLoading, isSuccess }] = useUpdateFaqMutation();
  const { t } = useTranslation("common");
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: faq?.question,
      answer: faq?.answer
    }
  });

  useEffect(() => {
    if (isSuccess) {
      setModalOpen(false);
    }
  }, [isSuccess, reset, dispatch]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(SetEditFaqError(""));
    updateFaq({
      id: faq.id,
      data
    });
  };


  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-white p-1.5 cursor-pointer rounded-full shadow hover:bg-gray-100 transition"
      >
        <FiEdit className="text-blue-600" size={20} />
      </button>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0" onInteractOutside={(e) => e.preventDefault()} showCloseButton={false}>
          <DialogHeader className="px-6 py-4 pb-2">
            <DialogTitle className="text-lg font-semibold text-center">{t("common:faqs.edit.title")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
            {EditFaqError && <ErrorAlert message={EditFaqError} />}
            <CustomTextArea label={t("common:faqs.form.question.label")}
                            name="question"
                            control={control}
                            placeholder={t("common:faqs.form.question.placeholder")}
                            rows={3} />
            <CustomTextArea label={t("common:faqs.form.answer.label")}
                            name="answer"
                            control={control}
                            placeholder={t("common:faqs.form.answer.placeholder")}
                            rows={3} />
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  reset({
                    question: faq?.question,
                    answer: faq?.answer
                  })
                }}
                variant="outline"
                className="w-1/2 bg-transparent"
              >
                {t("common:faqs.actions.cancel")}
              </Button>
              <div className="w-1/2">
                <FormButton isLoading={isLoading} loadingTitle={t("common:faqs.edit.loading")}>{t("common:faqs.edit.submit")}</FormButton>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditFaqModal;
