
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, Search } from "lucide-react";
import { Button } from "../ui/button";
import CustomPagination2 from "../../../tools/CustomPagination2";
import { useGetIssuedCertificatesQuery } from "@/redux/features/certificate/certificateApi";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import type { Certificate } from "@/types/certificate.type";

const CertificateList = () => {
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
  } = useSmartFetchHook(useGetIssuedCertificatesQuery);

  const certificateItems = items as Certificate[];

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
        {/* Left Section: Title + Total Count */}
        <div className="flex justify-between items-center gap-3 lg:gap-12 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Issued Certificates
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

      {/* Table Container with Fixed Height and Scrolling */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="relative">
          {/* Single table container with synchronized scrolling */}
          <div className="overflow-auto max-h-[600px]">
            <Table className="min-w-[800px]">
              <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                <TableRow className="hover:bg-yellow-50">
                  <TableHead className="w-16 bg-yellow-50">S.N.</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    Issued Date
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    Student
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    Course Name
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    Certificate Type
                  </TableHead>
                  <TableHead className="min-w-24 bg-yellow-50">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificateItems.length > 0 ? (
                  certificateItems.map((certificate, index) => (
                    <TableRow
                      key={certificate.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                    >
                      <TableCell className="w-16 text-muted-foreground">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {certificate?.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        <div className="flex items-center space-x-3 px-3 rounded-xl transition">
                          <img
                            src={certificate?.userImage}
                            alt={certificate?.userFullName || "Student"}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-gray-800 font-medium text-lg">
                              {certificate?.userFullName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {certificate?.userEmail}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        <div className="flex flex-col">
                          <span>{certificate?.courseTitle}</span>
                          <span className="text-sm text-muted-foreground">
                            {certificate?.categoryName} • {certificate?.courseLevel}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {certificate?.certificateTitle}
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex gap-x-2 items-center">
                          <Button
                            size="icon"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full"
                            title="View Certificate"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full"
                            title="Download Certificate"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No certificates found.
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

export default CertificateList;
