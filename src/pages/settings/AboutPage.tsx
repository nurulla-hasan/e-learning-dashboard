import PolicyLazyLoader from "@/components/loader/PolicyLazyLoader";
import PolicyLoading from "@/components/loader/PolicyLoading";
import { useGetAboutUsQuery } from "@/redux/features/policy/policyApi";
import { FileText } from "lucide-react"
import { lazy, Suspense, type ReactNode } from "react";

const UpdateAboutForm = lazy(() => import("@/components/policy/UpdateAboutForm"));


const AboutUsPage = () => {
  const { data, isLoading, isSuccess, isError } = useGetAboutUsQuery(undefined);
  const about = data?.data;

  let content: ReactNode;

  if (isLoading) {
    return <PolicyLoading />
  }
  if (!isLoading && isSuccess && about) {
    content = (
      <>
        <Suspense fallback={<PolicyLazyLoader />}>
          <UpdateAboutForm content={about?.content} id={about?.id} />
        </Suspense>
      </>
    )
  }
  if (!isLoading && isError) {
    content = <h1>Server Error Occured</h1>
  }

  

  return (
    <div className="min-h-full bg-white rounded-md py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-cyan-500 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FileText className="mr-2" size={24} />
              About Us
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

export default AboutUsPage;