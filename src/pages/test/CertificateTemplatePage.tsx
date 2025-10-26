import PolicyLazyLoader from "@/components/loader/PolicyLazyLoader";
import ListLoading from "@/components/loader/ListLoading";
import ServerErrorCard from "@/components/card/ServerErrorCard";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { lazy, Suspense, useState } from "react";
import { Eye, Pencil, Search, ArrowLeft } from "lucide-react";
import CustomPagination2 from "../../../tools/CustomPagination2";
import { useGetCertificatesContentQuery } from "@/redux/features/certificate/certificateApi";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";

const UpdateCertificateTemplateForm = lazy(() => import("@/components/certificate/UpdateCertificateTemplateForm"));

const CertificateTemplatePage = () => {
  const [editing, setEditing] = useState<null | { id: string; content: string; title: string }>(null);

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
  } = useSmartFetchHook<any>(useGetCertificatesContentQuery as any);

  if (isLoading) {
    return <ListLoading />;
  }

  if (isError) {
    return <ServerErrorCard />;
  }

  if (editing) {
    return (
      <div className="min-h-full bg-white py-4 px-4">
        <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-cyan-500 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setEditing(null)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-cyan-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-white">Edit Certificate Template</h1>
              </div>
            </div>
          </div>
          <div className="p-6">
            <Suspense fallback={<PolicyLazyLoader />}>
              <UpdateCertificateTemplateForm
                id={editing.id}
                content={editing.content}
                title={editing.title}
              />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  // Only show table for listing and editing existing templates
  return (
    <div className="w-full mx-auto relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Left: Title + Total */}
        <div className="flex justify-between items-center gap-3 lg:gap-12 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Certificate Templates</h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">Total:</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">{total || 0}</span>
          </div>
        </div>
        {/* Right: Search */}
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

      {/* Table */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="relative">
          {/* Responsive Table with Horizontal Scroll */}
          <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
            <Table className="">
              <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                <TableRow className="hover:bg-yellow-50">
                  <TableHead className="w-16 bg-yellow-50">S.N.</TableHead>
                  <TableHead className="bg-yellow-50">Title</TableHead>
                  <TableHead className="bg-yellow-50">Course</TableHead>
                  <TableHead className="bg-yellow-50">Level</TableHead>
                  <TableHead className="bg-yellow-50">Instructor</TableHead>
                  <TableHead className="bg-yellow-50">Category</TableHead>
                  <TableHead className="bg-yellow-50">Placeholders</TableHead>
                  <TableHead className="bg-yellow-50">Created</TableHead>
                  <TableHead className="bg-yellow-50 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length > 0 ? (
                  items.map((item: any, index: number) => (
                    <TableRow key={item?.id || index} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                      <TableCell className="text-muted-foreground">{index + 1 + (page - 1) * limit}</TableCell>
                      <TableCell className=" font-medium text-foreground">
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-medium">{item?.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{item?.courseTitle}</TableCell>
                      <TableCell className="font-medium text-foreground">{item?.courseLevel}</TableCell>
                      <TableCell className="font-medium text-foreground">{item?.instructorName}</TableCell>
                      <TableCell className="font-medium text-foreground">{item?.categoryName}</TableCell>
                      <TableCell className="font-medium text-foreground">{typeof item?.placeholderCount === "number" ? item.placeholderCount : (item?.placeholders?.length || 0)}</TableCell>
                      <TableCell className="font-medium text-foreground">{item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" title="View">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] md:max-h-[80vh] overflow-y-auto mx-4">
                              <DialogHeader className="space-y-2">
                                <DialogTitle className="text-lg sm:text-xl font-semibold pr-8">
                                  {item?.title}
                                </DialogTitle>
                                <div className="text-xs sm:text-sm text-gray-500">
                                  {item?.courseTitle} • {item?.courseLevel} • {item?.categoryName}
                                </div>
                              </DialogHeader>
                              <div className="space-y-3 sm:space-y-4 mt-4">
                                {Array.isArray(item?.placeholders) && item.placeholders.length > 0 && (
                                  <div className="flex flex-wrap gap-1 sm:gap-2">
                                    {item.placeholders.map((ph: string, i: number) => (
                                      <span key={i} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border">
                                        {ph}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div className="border rounded-md p-2 sm:p-4 bg-gray-50">
                                  <div className="prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={{ __html: item?.htmlContents || "" }} />
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setEditing({
                                id: item?.id,
                                content: item?.htmlContents || "",
                                title: item?.title || "",
                              })
                            }
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No templates found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 md:fixed md:bottom-0 md:left-0 md:w-full bg-white border-t py-3 px-4 md:px-0">
        <div className="flex justify-center md:justify-start">
          <CustomPagination2 currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplatePage;