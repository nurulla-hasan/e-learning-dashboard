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
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DeleteCourseModal from "../modal/course/DeleteCourseModal";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import { useGetCoursesQuery } from "@/redux/features/course/courseApi";
import CustomPagination2 from "../../../tools/CustomPagination2";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";

// Course interface matching API response
interface ICourse {
  id: string;
  courseTitle: string;
  categoryName: string;
  price: number;
  instructorName: string;
  instructorImage: string;
  totalEnrollments: number;
  createdAt: string;
}

const CourseList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    items,
    isLoading,
    isError,
  } = useSmartFetchHook(useGetCoursesQuery);

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
            {t("common:courses.header.title")}
          </h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">{t("common:courses.header.totalLabel")}</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
              {total}
            </span>
          </div>
        </div>

        {/* Right Section: Search + Add New */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("common:courses.search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Add New Button */}
          <Button
            onClick={() => navigate("/add-course")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {t("common:courses.actions.add")}
          </Button>
        </div>
      </div>

      {/* Table Container with Fixed Height and Scrolling */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="relative">
          {/* Single table container with synchronized scrolling */}
          <div className="overflow-auto">
            <Table className="">
              <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                <TableRow className="hover:bg-yellow-50">
                  <TableHead className="w-16 bg-yellow-50">{t("common:courses.table.headers.sn")}</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    {t("common:courses.table.headers.course")}
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    {t("common:courses.table.headers.category")}
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    {t("common:courses.table.headers.price")}
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    {t("common:courses.table.headers.instructor")}
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    {t("common:courses.table.headers.enrolled")}
                  </TableHead>
                  <TableHead className="min-w-24 bg-yellow-50">
                    {t("common:courses.table.headers.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  (items as ICourse[]).map((course, index) => (
                    <TableRow
                      key={course?.id || index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                    >
                      <TableCell className="w-16 text-muted-foreground">
                        {index + 1 + (currentPage - 1) * 10}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {course?.courseTitle}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {course?.categoryName}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        ${course?.price}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        <div className="flex items-center space-x-3 px-3 rounded-xl transition">
                          <img
                            src={course?.instructorImage}
                            alt={course?.instructorName}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <span className="text-gray-800 font-medium text-lg">
                            {course?.instructorName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {course?.totalEnrollments}
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              navigate(`/update-course/${course?.id}`)
                            }
                            size="icon"
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <DeleteCourseModal courseId={course?.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {t("common:courses.table.empty")}
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

export default CourseList;
