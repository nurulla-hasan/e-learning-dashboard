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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

      {/* Table */}
      <ScrollArea className="w-[calc(100vw-64px)] lg:w-full overflow-hidden overflow-x-auto rounded-xl whitespace-nowrap border border-border bg-card">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-yellow-50">
            <TableRow>
              <TableHead>
                {t("users.table.headers.sn")}
              </TableHead>
              <TableHead>
                {t("users.table.headers.name")}
              </TableHead>
              <TableHead>
                {t("users.table.headers.email")}
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("users.table.headers.role")}
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("users.table.headers.created")}
              </TableHead>
              <TableHead>
                {t("users.table.headers.status")}
              </TableHead>
              <TableHead className="text-center">
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
                  <TableCell>
                    {index + 1 + (page - 1) * limit}
                  </TableCell>
                  <TableCell>
                    {user.fullName}
                  </TableCell>
                  <TableCell>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {user.role}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
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
                  </TableCell>
                  <TableCell className="text-center">
                    <ToggleButton user={user} />
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

export default UserList;
