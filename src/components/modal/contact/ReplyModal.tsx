import { useState } from "react";
import { Reply } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// type TFormValues = z.infer<typeof replySchema>;

type TProps = {
    contactId: string
}

const ReplyModal = ({ contactId }: TProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  //const [reply, { isLoading, isSuccess, reset }] = useReplyContactMutation();
  // const { handleSubmit, control, setValue, } = useForm<TFormValues>({
  //   resolver: zodResolver(replySchema),
  // });

  console.log(contactId)

  
  //if success
  //  useEffect(() => {
  //   if (!isLoading && isSuccess) {
  //     setValue("replyText", "");
  //     setModalOpen(false);
  //   }
  // }, [isLoading, isSuccess, reset, setValue]);


  // const onSubmit: SubmitHandler<TFormValues> = (data) => {
  //   console.log(data, contactId)
  //   // reply({
  //   //   id: contactId,
  //   //   data: data,
  //   // });
  // };

  return (
    <>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {/* Trigger Button */}
        <DialogTrigger asChild>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer p-2 text-white rounded-full"
          >
            <Reply size={18} />
          </button>
        </DialogTrigger>

        {/* Modal Content */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reply Message</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 mt-2">
              <Label htmlFor="question" className="text-sm font-medium text-foreground">
                Message
              </Label>
              <Textarea
                id="question"
                placeholder="write a question..."
                className="min-h-[80px] resize-y"
              />
            </div>

          <DialogFooter>
            <Button onClick={() => setModalOpen(false)} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReplyModal;
