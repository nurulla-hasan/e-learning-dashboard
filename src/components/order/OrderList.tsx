import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search } from "lucide-react";
import { Button } from "../ui/button";
import OrderDetailsModal from "../modal/order/OrderDetailsModal";
import CustomPagination2 from "../../../tools/CustomPagination2";
import { useGetCompanyOrdersQuery, useGetEnrolledStudentOrdersQuery } from "@/redux/features/order/orderApi";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";

const OrderList = () => {
  const [activeTab, setActiveTab] = useState<"student" | "company">("student");

  // Helper to transform object params to IParam[] expected by order APIs
  const toParamArray = (obj: Record<string, unknown>) =>
    Object.entries(obj).reduce<{ name: string; value: string }[]>((acc, [name, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc.push({ name, value: String(value) });
      }
      return acc;
    }, []);

  // Wrapper hooks so useSmartFetchHook can pass object params but order APIs receive array params
  const useStudentOrdersHook = (params: any, opts?: any) =>
    useGetEnrolledStudentOrdersQuery(toParamArray(params), opts);

  const useCompanyOrdersHook = (params: any, opts?: any) =>
    useGetCompanyOrdersQuery(toParamArray(params), opts);

  // Student orders hook (skipped when company tab is active)
  const {
    searchTerm: studentSearchTerm,
    setSearchTerm: setStudentSearchTerm,
    currentPage: studentCurrentPage,
    setCurrentPage: setStudentCurrentPage,
    totalPages: studentTotalPages,
    total: studentTotal,
    page: studentPage,
    limit: studentLimit,
    items: studentItems,
    isLoading: studentLoading,
    isError: studentError,
  } = useSmartFetchHook<any>(useStudentOrdersHook as any, {}, {}, { skip: activeTab !== "student" });

  // Company orders hook (skipped when student tab is active)
  const {
    searchTerm: companySearchTerm,
    setSearchTerm: setCompanySearchTerm,
    currentPage: companyCurrentPage,
    setCurrentPage: setCompanyCurrentPage,
    totalPages: companyTotalPages,
    total: companyTotal,
    page: companyPage,
    limit: companyLimit,
    items: companyItems,
    isLoading: companyLoading,
    isError: companyError,
  } = useSmartFetchHook<any>(useCompanyOrdersHook as any, {}, {}, { skip: activeTab !== "company" });

  const isLoading = activeTab === "student" ? studentLoading : companyLoading;
  const isError = activeTab === "student" ? studentError : companyError;

  const searchTerm = activeTab === "student" ? studentSearchTerm : companySearchTerm;
  const setSearchTerm = activeTab === "student" ? setStudentSearchTerm : setCompanySearchTerm;

  const currentPage = activeTab === "student" ? studentCurrentPage : companyCurrentPage;
  const setCurrentPage = activeTab === "student" ? setStudentCurrentPage : setCompanyCurrentPage;

  const totalPages = activeTab === "student" ? studentTotalPages : companyTotalPages;
  const total = activeTab === "student" ? studentTotal : companyTotal;
  const page = activeTab === "student" ? studentPage : companyPage;
  const limit = activeTab === "student" ? studentLimit : companyLimit;
  const items = activeTab === "student" ? studentItems : companyItems;

  if (isLoading) return <ListLoading />;
  if (isError) return <ServerErrorCard />;

  return (
    <div className="w-full mx-auto relative">
      {/* Tabs + Header Section */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className={activeTab === "student" ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-muted text-foreground"}
            onClick={() => setActiveTab("student")}
          >
            Student Orders
          </Button>
          <Button
            variant="ghost"
            className={activeTab === "company" ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-muted text-foreground"}
            onClick={() => setActiveTab("company")}
          >
            Company Orders
          </Button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Section: Title + Total Count */}
          <div className="flex justify-between items-center gap-3 w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Order List
            </h1>
            <div className="flex items-center">
              <span className="text-sm sm:text-base text-gray-600">Total:</span>
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
                {total || 0}
              </span>
            </div>
          </div>

          {/* Right Section: Search + Add New */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container with Fixed Height and Scrolling */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="relative">
          {/* Single table container with synchronized scrolling */}
          <div className="overflow-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                <TableRow className="hover:bg-yellow-50">
                  <TableHead className="w-16 bg-yellow-50">S.N.</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">Order No.</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    Student/Company Name
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">Date</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    Amount
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    Invoice
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    Payment Status
                  </TableHead>
                  <TableHead className="min-w-24 bg-yellow-50">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  items?.map((order: any, index: number) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                    >
                      <TableCell className="w-16 text-muted-foreground">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {order?.invoiceId ?? order?.id ?? "-"}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {activeTab === "student" ? order?.user?.fullName ?? "-" : (order?.userFullName ?? "-")}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {order?.enrolledAt ? new Date(order.enrolledAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {activeTab === "student" ? (order?.totalAmount ?? order?.course?.price ?? order?.course?.discountPrice ?? "-") : (order?.coursePrice ?? "-")}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-normal"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                      <TableCell className="min-w-24">
                        <button
                          className={`px-3 py-1.5 border w-28 rounded-xl ${
                            (order?.paymentStatus?.toUpperCase?.() === "PAID" || order?.paymentStatus?.toUpperCase?.() === "COMPLETED")
                              ? "border-green-200 text-green-600"
                              : "border-red-200 text-red-600"
                          }`}
                        >
                          {order?.paymentStatus}
                        </button>
                      </TableCell>
                      <TableCell className="min-w-24">
                        <OrderDetailsModal />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No Orders found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Fixed Pagination at bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t py-3">
        <CustomPagination2
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default OrderList;
