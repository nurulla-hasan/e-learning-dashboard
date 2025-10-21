import { useState } from "react";
import { Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { IContact } from "@/types/contact.type";

type TProps = {
  contact: IContact
}

const ViewContactModal = ({ contact }: TProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-gray-600 hover:bg-gray-700 cursor-pointer p-2 text-white rounded-full"
      >
        <Eye size={18} />
      </button>


      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <div className=" p-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Original Message */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Message
                  </span>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {contact?.message}
                  </p>
                </div>
              </div>

              {/* Reply Message */}
              <div className="p-6 bg-gray-50">
                <div className="ml-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Reply
                    </span>
                  </div>
                  {/* <div className={`${contact?.replyText ? 'border-green-400 bg-green-50' : 'bg-red-50 border-red-400'} border-l-4  rounded-lg p-4`}>
                    <p className="text-gray-800 leading-relaxed">
                      {contact?.replyText ? contact?.replyText : "There is no reply message"}
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog >
    </>
  );
};

export default ViewContactModal;
