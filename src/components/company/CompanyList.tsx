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
import useSmartFetchHook from "@/hooks/useSmartFetchHook";

import CustomPagination2 from "../../../tools/CustomPagination2";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import { useGetCompaniesQuery } from "@/redux/features/company/companyApi";
import { useTranslation } from "react-i18next";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";

interface TCompanyRow {
  id: string;
  companyName: string;
  companyEmail: string;
  role?: string;
  createdAt?: string;
  companyVatId?: string;
  registrationDate?: string;
  companyAddress?: string;
  companyImage?: string | null;
}

const CompanyList = () => {
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
  } = useSmartFetchHook(useGetCompaniesQuery);

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
            {t("companies.header.title")}
          </h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">
              {t("companies.header.totalLabel")}
            </span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
              {total || 0}
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("companies.search.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <ScrollArea className="w-[calc(100vw-60px)]  lg:w-full overflow-hidden overflow-x-auto rounded-xl whitespace-nowrap">
        <Table>
          <TableHeader className="bg-yellow-50">
            <TableRow>
              <TableHead>
                {t("companies.table.headers.sn")}
              </TableHead>
              <TableHead>
                {t("companies.table.headers.company")}
              </TableHead>
              <TableHead>
                {t("companies.table.headers.vat")}
              </TableHead>
              <TableHead>
                {t("companies.table.headers.registration")}
              </TableHead>
              <TableHead>
                {t("companies.table.headers.address")}
              </TableHead>
              <TableHead className="text-center">
                {t("companies.table.headers.role")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.length > 0 ? (
              (items as TCompanyRow[])?.map((item, index) => (
                <TableRow
                  key={item?.id || index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                >
                  <TableCell>
                    {index + 1 + (page - 1) * limit}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3 px-3 rounded-xl">
                      {item?.companyImage ? (
                        <img
                          src={item.companyImage}
                          alt={item.companyName}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-200" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-medium text-sm">{item?.companyName}</span>
                        <span className="text-xs text-muted-foreground">{item?.companyEmail}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item?.companyVatId || t("companies.common.notAvailable")}
                  </TableCell>
                  <TableCell>
                    {item?.registrationDate
                      ? new Date(item.registrationDate).toLocaleDateString()
                      : t("companies.common.notAvailable")}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {item?.companyAddress || t("companies.common.notAvailable")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`rounded-full ${
                        item?.role === "COMPANY"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item?.role
                        ? t(`companies.role.${item.role}`, {
                            defaultValue: item.role,
                          })
                        : t("companies.common.notAvailable")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t("companies.table.empty")}
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

export default CompanyList;
