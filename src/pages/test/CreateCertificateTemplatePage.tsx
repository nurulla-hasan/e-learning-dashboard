import { Suspense, lazy } from "react";
import PolicyLazyLoader from "@/components/loader/PolicyLazyLoader";

const CreateCertificateTemplateForm = lazy(() => import("@/components/certificate/CreateCertificateTemplateForm"));

const CreateCertificateTemplatePage = () => {
  return (
    <div className="min-h-full bg-white py-4 px-4">
      <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-cyan-500 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Create Certificate Template</h1>
        </div>
        <div className="p-6">
          <Suspense fallback={<PolicyLazyLoader /> }>
            <CreateCertificateTemplateForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CreateCertificateTemplatePage;
