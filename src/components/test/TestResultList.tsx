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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetTestAttemptsQuery } from "@/redux/features/test/testApi";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import type { TTestAttempt } from "@/types/test.attempt.type";
import CustomPagination2 from "../../../tools/CustomPagination2";

const TestResultList = () => {
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
  } = useSmartFetchHook<TTestAttempt>(useGetTestAttemptsQuery as any);

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
            Test Results
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
                  <TableHead className="bg-yellow-50">
                    Student
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    Course Name
                  </TableHead>
                  <TableHead className="bg-yellow-50">Date</TableHead>
                  <TableHead className="bg-yellow-50">Score</TableHead>
                  <TableHead className="bg-yellow-50">
                    Result
                  </TableHead>
                  <TableHead className="min-w-24 bg-yellow-50 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length > 0 ? (
                  items.map((attempt, index) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                    >
                      <TableCell className="w-16 text-muted-foreground">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center space-x-3 px-3 rounded-xl transition">
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
                      <TableCell className="font-medium text-foreground">
                        {attempt?.courseTitle}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {attempt?.completedAt ? new Date(attempt.completedAt).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {`${attempt?.score ?? 0}/${attempt?.totalMarks ?? 0}`} {typeof attempt?.percentage === "number" ? `(${attempt.percentage}%)` : ""}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${attempt?.isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {attempt?.isPassed ? "Passed" : "Failed"}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-24 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => attempt?.id && navigate(`/test-attempts/${attempt.id}`)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No results found.
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

export default TestResultList;
