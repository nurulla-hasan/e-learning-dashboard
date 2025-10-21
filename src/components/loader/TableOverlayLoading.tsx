import { FaSpinner } from "react-icons/fa";

const TableOverlayLoading = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center h-[600px] justify-center bg-gray-50/20 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-2">
        <FaSpinner className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    </div>
  )
}


export default TableOverlayLoading;