/* eslint-disable @typescript-eslint/no-explicit-any */
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
import CustomPagination2 from "../../../tools/CustomPagination2";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import { useGetCompanyOrdersQuery } from "@/redux/features/order/orderApi";
import ListLoading from "@/components/loader/ListLoading";
import ServerErrorCard from "@/components/card/ServerErrorCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// Response shape based on provided example
interface IEmployeeEnrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  coursePrice?: number;
  courseLevel?: string;
  certificate?: boolean;
  lifetimeAccess?: boolean;
  instructorName?: string;
  categoryName?: string;
  paymentStatus?: string;
  enrolledAt?: string;
  userId?: string;
  userFullName?: string;
  companyName?: string
  userEmail?: string;
  userImage?: string | null;
  userPhoneNumber?: string;
}

const EmployeeList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
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
  } = useSmartFetchHook<IEmployeeEnrollment>(useGetCompanyOrdersQuery as any);

  const paymentBadgeMap = useMemo(
    () => ({
      COMPLETED: "bg-green-100 text-green-700",
      PAID: "bg-green-100 text-green-700",
      PENDING: "bg-yellow-100 text-yellow-700",
      FAILED: "bg-red-100 text-red-700",
      DEFAULT: "bg-gray-100 text-gray-700",
    }),
    []
  );

  const accessBadgeMap = {
    LIFETIME: "bg-blue-100 text-blue-700",
    LIMITED: "bg-gray-100 text-gray-700",
  } as const;

  const certificateBadgeMap = {
    ENABLED: "bg-green-100 text-green-700",
    DISABLED: "bg-red-100 text-red-700",
  } as const;

  const safeText = (value: string | number | undefined | null) =>
    value ?? t("employees.common.notAvailable");

  const formatDateTime = (value?: string) =>
    value ? new Date(value).toLocaleString() : t("employees.common.notAvailable");

  const getPaymentBadge = (status?: string) => {
    const normalized = (status || "UNKNOWN").toUpperCase();
    const className = paymentBadgeMap[normalized as keyof typeof paymentBadgeMap] ?? paymentBadgeMap.DEFAULT;
    const label = t(`employees.payment.status.${normalized}`, {
      defaultValue: status || t("employees.payment.status.UNKNOWN"),
    });
    return { className, label };
  };

  if (isLoading) return <ListLoading />;
  if (isError) return <ServerErrorCard />;

  return (
    <div className="w-full mx-auto relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Left: Title + Total */}
        <div className="flex justify-between items-center gap-3 lg:gap-12 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {t("employees.header.title")}
          </h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">
              {t("employees.header.totalLabel")}
            </span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
              {total || 0}
            </span>
          </div>
        </div>

        {/* Right: Search + Create */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("employees.search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
            onClick={() => navigate("/employees/create")}
          >
            {t("employees.actions.create")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="relative">
          <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
            <Table className="min-w-[900px]">
              <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                <TableRow className="hover:bg-yellow-50">
                  <TableHead className="w-16 bg-yellow-50">
                    {t("employees.table.headers.sn")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("employees.table.headers.employee")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("employees.table.headers.company")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("employees.table.headers.course")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("employees.table.headers.enrolled")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("employees.table.headers.payment")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("employees.table.headers.access")}
                  </TableHead>
                  <TableHead className="bg-yellow-50">
                    {t("employees.table.headers.certificate")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(items) && items.length > 0 ? (
                  (items as IEmployeeEnrollment[]).map((row, index) => (
                    <TableRow key={row.id || index} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                      <TableCell className="text-muted-foreground">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {row.userImage ? (
                            <img
                              src={row.userImage}
                              alt={row.userFullName || t("employees.table.defaults.employeeImageAlt")}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-200" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-gray-800 font-medium">
                              {safeText(row.userFullName)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {safeText(row.userEmail)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {safeText(row.companyName)}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        <div className="flex flex-col">
                          <span>{safeText(row.courseTitle)}</span>
                          <span className="text-xs text-muted-foreground">
                            {[
                              safeText(row.categoryName),
                              safeText(row.courseLevel),
                              safeText(row.instructorName),
                            ]
                              .filter((segment) => segment !== t("employees.common.notAvailable"))
                              .join(" • ") || t("employees.common.notAvailable")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {formatDateTime(row.enrolledAt)}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {(() => {
                          const { className, label } = getPaymentBadge(row.paymentStatus);
                          return (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
                              {label}
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {(() => {
                          const key = row.lifetimeAccess ? "LIFETIME" : "LIMITED";
                          const className = accessBadgeMap[key];
                          const label = t(`employees.access.${key}`);
                          return (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
                              {label}
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {(() => {
                          const key = row.certificate ? "ENABLED" : "DISABLED";
                          const className = certificateBadgeMap[key];
                          const label = t(`employees.certificate.${key}`);
                          return (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
                              {label}
                            </span>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {t("employees.table.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
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

export default EmployeeList;
