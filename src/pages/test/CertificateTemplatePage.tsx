import PolicyLazyLoader from "@/components/loader/PolicyLazyLoader";
import PolicyLoading from "@/components/loader/PolicyLoading";
import { useGetSingleCertificateQuery } from "@/redux/features/certificate/certificateApi";
import { FileText } from "lucide-react";
import { lazy, Suspense, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const UpdateCertificateTemplateForm = lazy(() => import("@/components/certificate/UpdateCertificateTemplateForm"));

const CertificateTemplatePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const certificateId = params.id;

  const { data, isLoading, isSuccess, isError } = useGetSingleCertificateQuery(certificateId || "", { skip: !certificateId });
  const certificate = data?.data;

  let content: ReactNode;

  if (isLoading) {
    return <PolicyLoading />;
  }

  if (!isLoading && isSuccess && certificate) {
    content = (
      <>
        <Suspense fallback={<PolicyLazyLoader />}>
          <UpdateCertificateTemplateForm
            id={certificate?.id}
            content={certificate?.content}
            title={certificate?.title}
            description={certificate?.description}
          />
        </Suspense>
      </>
    );
  } else if (!certificateId) {
    // If no certificate ID, show form for creating new certificate
    content = (
      <>
        <Suspense fallback={<PolicyLazyLoader />}>
          <UpdateCertificateTemplateForm />
        </Suspense>
      </>
    );
  }

  if (!isLoading && isError) {
    content = <h1 className="text-center text-red-600">Server Error Occurred</h1>;
  }

  return (
    <div className="min-h-full bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-cyan-500 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/certificate-issued")}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-cyan-600"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FileText className="mr-2" size={24} />
                Certificate Template
              </h1>
            </div>
          </div>
        </div>
        <div className="p-6">
          {content}
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplatePage;