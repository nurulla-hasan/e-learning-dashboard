import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";

import CustomPagination2 from "../../../tools/CustomPagination2";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import { useGetCompaniesQuery } from "@/redux/features/company/companyApi";
import type { CompanyUser } from "@/types/company.type";

const CompanyList = () => {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    page,
    limit,
    items,
    isLoading,
    isError,
  } = useSmartFetchHook(useGetCompaniesQuery);

  if (isLoading) {
    return <ListLoading />;
  }

  if (isError) {
    return <ServerErrorCard />;
  }

  return (
    <div className="w-full mx-auto relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex justify-between items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Company List
          </h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">Total:</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
              {total}
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
                  <TableHead className="min-w-32 bg-yellow-50">Student Name</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">Registration Date</TableHead>
                  <TableHead className="min-w-48 bg-yellow-50">Email</TableHead>
                  <TableHead className="min-w-48 bg-yellow-50">Company Name</TableHead>
                  <TableHead className="min-w-48 bg-yellow-50">Company Address</TableHead>
                  <TableHead className="min-w-48 bg-yellow-50">Vat Id</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length > 0 ? (
                  (items as CompanyUser[])?.map((item, index) => {
                    return (
                    <TableRow
                      key={item?.id || index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                    >
                      <TableCell className="w-16 text-muted-foreground">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {item?.fullName}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {new Date(item?.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="min-w-48 text-muted-foreground">
                        {item?.email}
                      </TableCell>
                      <TableCell className="min-w-48 text-muted-foreground hidden sm:table-cell">
                        {item?.company?.companyName}
                      </TableCell>
                      <TableCell className="min-w-48 text-muted-foreground hidden sm:table-cell">
                        {item?.company?.companyAddress}
                      </TableCell>
                      <TableCell className="min-w-48 text-muted-foreground hidden sm:table-cell">
                        {item?.company?.companyVatId}
                      </TableCell>
                    </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No companies found matching your search.
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

export default CompanyList;
