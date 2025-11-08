import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetTestAttemptsQuery } from "@/redux/features/test/testApi";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import type { TTestAttempt } from "@/types/test.attempt.type";
import CustomPagination2 from "../../../tools/CustomPagination2";
import { useTranslation } from "react-i18next";

const TestResultList = () => {
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
  } = useSmartFetchHook<TTestAttempt>(useGetTestAttemptsQuery);

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
            {t("common:testResults.list.title")}
          </h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">
              {t("common:testResults.list.totalLabel")}
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
              placeholder={t("common:testResults.list.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <ScrollArea className="w-[calc(100vw-60px)] lg:w-full overflow-hidden overflow-x-auto rounded-xl whitespace-nowrap border border-border bg-card">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-yellow-50">
            <TableRow>
              <TableHead>{t("common:testResults.table.headers.sn")}</TableHead>
              <TableHead>{t("common:testResults.table.headers.student")}</TableHead>
              <TableHead>{t("common:testResults.table.headers.courseName")}</TableHead>
              <TableHead>{t("common:testResults.table.headers.date")}</TableHead>
              <TableHead>{t("common:testResults.table.headers.score")}</TableHead>
              <TableHead>{t("common:testResults.table.headers.result")}</TableHead>
              <TableHead className="text-center">
                {t("common:testResults.table.headers.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.length > 0 ? (
              items.map((attempt, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                >
                  <TableCell>{index + 1 + (page - 1) * limit}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 px-3">
                      <img
                        src={attempt?.userImage}
                        alt={attempt?.userFullName || "User"}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-medium text-lg">
                          {attempt?.userFullName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {attempt?.userEmail}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {attempt?.courseTitle}
                  </TableCell>
                  <TableCell>
                    {attempt?.completedAt
                      ? new Date(attempt.completedAt).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {`${attempt?.score ?? 0}/${attempt?.totalMarks ?? 0}`}
                    {typeof attempt?.percentage === "number"
                      ? ` (${attempt.percentage}%)`
                      : ""}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${attempt?.isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {attempt?.isPassed
                        ? t("common:testResults.table.statuses.passed")
                        : t("common:testResults.table.statuses.failed")}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        attempt?.id && navigate(`/test-attempts/${attempt.id}`)
                      }
                    >
                      {t("common:testResults.actions.view")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {t("common:testResults.table.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

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

export default TestResultList;
