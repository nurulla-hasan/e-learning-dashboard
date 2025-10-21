import PolicyLazyLoader from "@/components/loader/PolicyLazyLoader";
import PolicyLoading from "@/components/loader/PolicyLoading";
import { useGetTermsConditionQuery } from "@/redux/features/policy/policyApi"
import { FileText } from "lucide-react"
import { lazy, Suspense, type ReactNode } from "react";

const UpdateTermsForm = lazy(() => import("@/components/policy/UpdateTermsForm"));


const TermsPage = () => {
  const { data, isLoading, isSuccess, isError } = useGetTermsConditionQuery(undefined);
  const terms = data?.data;

  let content: ReactNode;


  if (isLoading) {
    return <PolicyLoading />
  }
  
  if (!isLoading && isSuccess && terms) {
    content = (
      <>
        <Suspense fallback={<PolicyLazyLoader />}>
          <UpdateTermsForm content={terms?.content} id={terms?.id} />
        </Suspense>
      </>
    )
  }

  if (!isLoading && isError) {
    content = <h1>Server Error Occured</h1>
  }


  return (
    <div className="min-h-full bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-cyan-500 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FileText className="mr-2" size={24} />
              Terms & Condition
            </h1>
          </div>
        </div>
        <div className="p-6">
          {content}
        </div>
      </div>
    </div>
  )
}

export default TermsPage;