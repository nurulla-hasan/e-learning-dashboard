import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Search } from "lucide-react";
import DeleteTestModal from "../modal/test/DeleteTestModal";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import CustomPagination2 from "../../../tools/CustomPagination2";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import type { Test } from "@/types/test.type";
import { useGetTestsQuery } from "@/redux/features/test/testApi";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import { useTranslation } from "react-i18next";

const TestList = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
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
  } = useSmartFetchHook(useGetTestsQuery);

  const testItems = items as Test[];

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
        <div className="flex justify-between items-center gap-3 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {t("common:tests.list.title")}
          </h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">
              {t("common:tests.list.totalLabel")}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("common:tests.list.searchPlaceholder")}
              className="pl-10"
            />
          </div>

          <Button
            onClick={() => navigate("/add-test")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {t("common:tests.list.addNew")}
          </Button>
        </div>
      </div>

      {/* Table Container with Fixed Height and Scrolling */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="relative">
          {/* Single table container with synchronized scrolling */}
          <div className="overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                <TableRow className="hover:bg-yellow-50">
                  <TableHead className="w-16 bg-yellow-50">
                    {t("common:tests.table.headers.sn")}
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    {t("common:tests.table.headers.testName")}
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    {t("common:tests.table.headers.courseName")}
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    {t("common:tests.table.headers.passingScore")}
                  </TableHead>
                  <TableHead className="min-w-24 bg-yellow-50">
                    {t("common:tests.table.headers.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testItems.length > 0 ? (
                  testItems.map((item: Test, index) => (
                    <TableRow
                      key={item.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                    >
                      <TableCell className="w-16 text-muted-foreground">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {item.title}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {item.courseTitle
                          ? item.courseTitle
                          : t("common:tests.table.courseNotAssigned")}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {item.passingScore}
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => navigate(`/update-test/${item?.id}`)}
                            size="icon"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <DeleteTestModal testId={item.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {t("common:tests.table.empty")}
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

export default TestList;
