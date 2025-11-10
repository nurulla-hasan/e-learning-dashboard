import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IMeta } from "@/types/global.type";
import DeleteSubscriberModal from "../modal/subscriber/DeleteSubscriberModal";
import type { ISubscriber } from "@/types/subscriber.type";
import CustomPagination from "../form/CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React from "react";
import { useTranslation } from "react-i18next";

type TProps = {
  subscibers: ISubscriber[];
  meta: IMeta;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
};

const SubscriberTable = ({
  subscibers,
  meta,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
}: TProps) => {
  const { t } = useTranslation("common");
  return (
    <div className="space-y-4">
      <div className="border border-border rounded-xl bg-card">
        <ScrollArea className="w-[calc(100vw-64px)] lg:w-full overflow-hidden overflow-x-auto rounded-xl whitespace-nowrap">
          <Table className="min-w-[720px]">
            <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
              <TableRow className="hover:bg-yellow-50">
                <TableHead className="w-16 bg-yellow-50">
                  {t("common:subscribers.table.headers.sn")}
                </TableHead>
                <TableHead className="min-w-48 bg-yellow-50">
                  {t("common:subscribers.table.headers.email")}
                </TableHead>
                <TableHead className="min-w-48 bg-yellow-50">
                  {t("common:subscribers.table.headers.subscribeDate")}
                </TableHead>
                <TableHead className="min-w-32 bg-yellow-50">
                  {t("common:subscribers.table.headers.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscibers?.length > 0 ? (
                subscibers?.map((subscriber, index) => (
                  <TableRow
                    key={subscriber?.id ?? index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                  >
                    <TableCell className="w-16 text-muted-foreground">
                      {Number(index + 1) + (meta?.page - 1) * pageSize}
                    </TableCell>
                    <TableCell className="min-w-48 text-muted-foreground">
                      {subscriber?.email}
                    </TableCell>
                    <TableCell className="min-w-48 text-muted-foreground">
                      {subscriber?.createdAt?.split("T")[0]}
                    </TableCell>
                    <TableCell className="min-w-24">
                      <DeleteSubscriberModal subscriberId={subscriber?.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("common:subscribers.table.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Pagination */}
      <div className="fixed bottom-0 left-0 flex w-full bg-white border-t py-3">
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={meta?.totalPages}
          dataLength={subscibers?.length}
        />
        {meta?.total > 50 && (
          <div className="flex flex-1 justify-end">
            <Select
              value={pageSize.toString()}
              aria-label="Results per page"
              onValueChange={(val) => {
                setCurrentPage(1);
                setPageSize(Number(val));
              }}
            >
              <SelectTrigger
                id="results-per-page"
                className="w-fit whitespace-nowrap"
              >
                <SelectValue placeholder={t("common:subscribers.pagination.selectPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">{t("common:subscribers.pagination.pageSize", { count: 10 })}</SelectItem>
                <SelectItem value="20">{t("common:subscribers.pagination.pageSize", { count: 20 })}</SelectItem>
                <SelectItem value="50">{t("common:subscribers.pagination.pageSize", { count: 50 })}</SelectItem>
                <SelectItem value="100">{t("common:subscribers.pagination.pageSize", { count: 100 })}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriberTable;
