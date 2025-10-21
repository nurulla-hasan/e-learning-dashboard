import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import useDebounce from "@/hooks/useDebounce"
import { lazy, Suspense, useState, type ReactNode } from "react"
import { useGetSubscribersQuery } from "@/redux/features/newsletter/newsletterApi"
import ListLoading from "../loader/ListLoading"
import TableOverlayLoading from "../loader/TableOverlayLoading"
const SubscriberTable = lazy(() => import("./SubscriberTable"));


const SubscriberList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const { searchTerm } = useDebounce({searchQuery, setCurrentPage})
  const { data, isLoading, isFetching, isError } = useGetSubscribersQuery([
    { name: "page", value: currentPage},
    { name: "limit", value: pageSize },
    { name: "searchTerm", value: searchTerm }
  ]);

  

  const subscibers = data?.data || [];
  const meta = data?.meta || {};

 
  let content:ReactNode;

  if(isLoading){
    content = <ListLoading/>
  }

  if(!isLoading && !isError){
    content = <Suspense fallback={<ListLoading/>}>
      <SubscriberTable subscibers={subscibers} meta={meta} currentPage={currentPage} setCurrentPage={setCurrentPage} pageSize={pageSize} setPageSize={setPageSize}/>
    </Suspense> 
  }

  if(!isLoading && isError){
    content = <h1 className="text-red-500">Something Went Wrong</h1>
  }



  return (
    <div className="w-full mx-auto relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex justify-between items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Subscriber List</h1>
          <div className="flex items-center">
             <span className="text-sm sm:text-base text-gray-600">Total:</span>
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
                {meta?.total || 0}
              </span>
            </div>
        </div>
       <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
       <div className="relative">
        {content}
        {!isLoading && isFetching && <TableOverlayLoading />}
      </div>
    </div>
  )
}


export default SubscriberList;