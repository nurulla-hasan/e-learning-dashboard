import FaqLoading from "@/components/loader/FaqLoading";
import CreateFaqModal from "@/components/modal/faq/CreateFaqModal";
import React, { Suspense } from "react";
const FaqList = React.lazy(() => import("../../components/faq/FaqList"));


const FaqsPage = () => {
  return (
    <div className="px-6 py-4 mx-auto min-h-full bg-white rounded-lg border border-gray-200">
     <div className="flex justify-between items-center mb-6">
       <h2 className="text-2xl font-semibold text-gray-800">FAQs</h2>
       <CreateFaqModal />
     </div>
      <Suspense fallback={<FaqLoading />}>
        <FaqList />
      </Suspense>
    </div>
  );
};

export default FaqsPage;