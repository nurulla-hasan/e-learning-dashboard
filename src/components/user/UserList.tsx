import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useGetUsersQuery } from "@/redux/features/user/userApi";
import type { IUser } from "@/types/user.type";

import CustomPagination2 from "../../../tools/CustomPagination2";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import ToggleButton from "./ToggleButton";
import { useTranslation } from "react-i18next";

const statusClassMap: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
  BLOCKED: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
  DEFAULT: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
};

const UserList = () => {
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
  } = useSmartFetchHook(useGetUsersQuery);

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
            {t("users.header.title")}
          </h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">
              {t("users.header.totalLabel")}
            </span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
              {total || 0}
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("users.search.placeholder")}
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
                  <TableHead className="w-16 bg-yellow-50">
                    {t("users.table.headers.sn")}
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    {t("users.table.headers.name")}
                  </TableHead>
                  <TableHead className="min-w-48 bg-yellow-50">
                    {t("users.table.headers.email")}
                  </TableHead>
                  <TableHead className="min-w-32 hidden sm:table-cell bg-yellow-50">
                    {t("users.table.headers.role")}
                  </TableHead>
                  <TableHead className="min-w-32 hidden sm:table-cell bg-yellow-50">
                    {t("users.table.headers.created")}
                  </TableHead>
                  <TableHead className="min-w-24 bg-yellow-50">
                    {t("users.table.headers.status")}
                  </TableHead>
                  <TableHead className="min-w-24 bg-yellow-50">
                    {t("users.table.headers.action")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length > 0 ? (
                  (items as IUser[])?.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                    >
                      <TableCell className="w-16 text-muted-foreground">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {user.fullName}
                      </TableCell>
                      <TableCell className="min-w-48 text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="min-w-32 text-muted-foreground hidden sm:table-cell">
                        {user.role}
                      </TableCell>
                      <TableCell className="min-w-32 text-muted-foreground hidden sm:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const normalizedStatus = (user.status || "UNKNOWN").toUpperCase();
                            const badgeClassName =
                              statusClassMap[normalizedStatus] ?? statusClassMap.DEFAULT;
                            const statusLabel = t(`users.status.${normalizedStatus}`, {
                              defaultValue: user.status || t("users.status.UNKNOWN"),
                            });
                            return (
                              <Badge
                                variant="secondary"
                                className={badgeClassName}
                              >
                                {statusLabel}
                              </Badge>
                            );
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex items-center gap-2">
                          <ToggleButton user={user} />
                          
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
                      {t("users.table.empty")}
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

export default UserList;
