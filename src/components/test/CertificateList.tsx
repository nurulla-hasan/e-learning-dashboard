
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Search } from "lucide-react";
import { Button } from "../ui/button";
import CustomPagination2 from "../../../tools/CustomPagination2";
import { useGetIssuedCertificatesQuery } from "@/redux/features/certificate/certificateApi";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import type { Certificate } from "@/types/certificate.type";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

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
  } = useSmartFetchHook<Certificate>(useGetIssuedCertificatesQuery);
  const { t } = useTranslation("common");

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
            {t("common:issuedCertificates.list.title")}
          </h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">
              {t("common:issuedCertificates.list.totalLabel")}
            </span>
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
              placeholder={t("common:issuedCertificates.list.searchPlaceholder")}
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
                  <TableHead className="w-16 bg-yellow-50">
                    {t("common:issuedCertificates.table.headers.sn")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("common:issuedCertificates.table.headers.issuedDate")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("common:issuedCertificates.table.headers.student")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("common:issuedCertificates.table.headers.courseName")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("common:issuedCertificates.table.headers.certificateType")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("common:issuedCertificates.table.headers.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  items.map((certificate, index) => (
                    <TableRow
                      key={certificate.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                    >
                      <TableCell className="w-16 text-muted-foreground">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className=" font-medium text-foreground">
                        {certificate?.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className=" font-medium text-foreground">
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
                      <TableCell className=" font-medium text-foreground">
                        <div className="flex flex-col">
                          <span>{certificate?.courseTitle}</span>
                          <span className="text-sm text-muted-foreground">
                            {certificate?.categoryName} • {certificate?.courseLevel}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className=" font-medium text-foreground">
                        {certificate?.certificateTitle}
                      </TableCell>
                      <TableCell className="">
                        <div className="flex gap-x-2 items-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                title={t("common:issuedCertificates.table.actions.view")}
                              >
                                <Eye />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>
                                  {certificate?.certificateTitle || t("common:issuedCertificates.dialog.titleFallback")}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {/* Top: Student + Basic Info */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    {certificate?.userImage && (
                                      <img src={certificate.userImage} alt={certificate?.userFullName || "Student"} className="w-12 h-12 rounded-lg object-cover" />
                                    )}
                                    <div>
                                      <div className="text-gray-900 font-medium">{certificate?.userFullName}</div>
                                      <div className="text-xs text-gray-500">{certificate?.userEmail}</div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="text-gray-500">
                                      {t("common:issuedCertificates.dialog.certificateId")}
                                    </div>
                                    <div className="text-gray-900 font-medium">{certificate?.certificateId}</div>
                                    <div className="text-gray-500">
                                      {t("common:issuedCertificates.dialog.issued")}
                                    </div>
                                    <div className="text-gray-900 font-medium">{certificate?.issueDate ? new Date(certificate.issueDate).toLocaleString() : "-"}</div>
                                  </div>
                                </div>

                                {/* Course */}
                                <div className="border rounded-lg p-3">
                                  <div className="text-sm font-semibold text-gray-700 mb-2">
                                    {t("common:issuedCertificates.dialog.courseSection.title")}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {certificate?.courseThumbnail && (
                                      <img src={certificate.courseThumbnail} alt={certificate?.courseTitle || "Course"} className="w-16 h-16 rounded object-cover" />
                                    )}
                                    <div className="flex-1">
                                      <div className="text-gray-900 font-medium">{certificate?.courseTitle}</div>
                                      <div className="text-xs text-gray-500">{certificate?.categoryName} • {certificate?.courseLevel} • {certificate?.instructorName}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Main Contents */}
                                {certificate?.mainContents && (
                                  <div className="border rounded-lg p-3">
                                    <div className="text-sm font-semibold text-gray-700 mb-2">
                                      {t("common:issuedCertificates.dialog.mainContents.title")}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {Object.entries(certificate.mainContents as Record<string, string | number>).map(([k, v]) => (
                                        <div key={k} className="flex flex-wrap items-center justify-between text-sm">
                                          <span className="text-gray-500">
                                            {t(`common:issuedCertificates.dialog.mainContents.labels.${k}`, k)}
                                          </span>
                                          <span className="text-gray-900 font-medium">{String(v)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
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
                      {t("common:issuedCertificates.table.empty")}
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
