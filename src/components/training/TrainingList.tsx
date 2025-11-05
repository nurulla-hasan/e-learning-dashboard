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
import { Search, Check } from "lucide-react";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import {
  useGetTrainingOrdersQuery,
  useUpdateTrainingOrderMutation,
} from "@/redux/features/training/trainingApi";

import CustomPagination2 from "../../../tools/CustomPagination2";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import { Button } from "../ui/button";
import TrainingDetailsModal from "@/components/modal/training/TrainingDetailsModal";
import { useTranslation } from "react-i18next";

interface TrainingItem {
  id: string;
  status: string;
  createdAt?: string;
  user?: { fullName?: string; email?: string; phoneNumber?: string };
  course?: { courseTitle?: string; price?: number; category?: { name?: string } };
}

const statusClassMap: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
  REJECTED: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
  DEFAULT: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
};

const TrainingList = () => {
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
  } = useSmartFetchHook<TrainingItem>(useGetTrainingOrdersQuery);

  const [updateTrainingOrder, { isLoading: updating }] = useUpdateTrainingOrderMutation();

  const handleAccept = async (id: string) => {
    try {
      await updateTrainingOrder({ id, data: { status: "CONFIRMED" } });
    } catch {
      // console.log("Failed to update training order:", error);
    }
  };

//   const handleReject = async (id: string) => {
//     try {
//       await updateTrainingOrder({ id, data: { status: "REJECTED" } });
//     } catch {}
//   };

  if (isLoading) return <ListLoading />;
  if (isError) return <ServerErrorCard />;

  return (
    <div className="w-full mx-auto relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex justify-between items-center gap-3 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {t("training.header.title")}
          </h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">
              {t("training.header.totalLabel")}
            </span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
              {total || 0}
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("training.search.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="relative">
          <div className="overflow-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                <TableRow className="hover:bg-yellow-50">
                  <TableHead className="w-16 bg-yellow-50">
                    {t("training.table.headers.sn")}
                  </TableHead>
                  <TableHead className="min-w-44 bg-yellow-50">
                    {t("training.table.headers.trainee")}
                  </TableHead>
                  <TableHead className="min-w-56 bg-yellow-50">
                    {t("training.table.headers.email")}
                  </TableHead>
                  <TableHead className="min-w-48 bg-yellow-50">
                    {t("training.table.headers.course")}
                  </TableHead>
                  <TableHead className="min-w-28 bg-yellow-50">
                    {t("training.table.headers.price")}
                  </TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">
                    {t("training.table.headers.created")}
                  </TableHead>
                  <TableHead className="min-w-28 bg-yellow-50">
                    {t("training.table.headers.status")}
                  </TableHead>
                  <TableHead className="min-w-40 bg-yellow-50">
                    {t("training.table.headers.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length ? (
                  (items as TrainingItem[]).map((trainingItem, index) => {
                    const normalizedStatusKey = (trainingItem.status || "UNKNOWN").toUpperCase();
                    const statusLabel = t(`training.status.${normalizedStatusKey}`, {
                      defaultValue: trainingItem.status || t("training.status.UNKNOWN"),
                    });
                    const badgeClassName =
                      statusClassMap[normalizedStatusKey] ?? statusClassMap.DEFAULT;

                    return (
                      <TableRow
                        key={trainingItem.id}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                      >
                        <TableCell className="w-16 text-muted-foreground">
                          {index + 1 + ((page || 1) - 1) * (limit || 0)}
                        </TableCell>
                        <TableCell className="min-w-44 font-medium text-foreground">
                          {trainingItem.user?.fullName || "-"}
                        </TableCell>
                        <TableCell className="min-w-56 text-muted-foreground">
                          {trainingItem.user?.email || "-"}
                        </TableCell>
                        <TableCell className="min-w-48 text-foreground">
                          {trainingItem.course?.courseTitle || "-"}
                        </TableCell>
                        <TableCell className="min-w-28 text-foreground">
                          {trainingItem.course?.price ?? "-"}
                        </TableCell>
                        <TableCell className="min-w-32 text-muted-foreground">
                          {trainingItem.createdAt
                            ? new Date(trainingItem.createdAt).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="min-w-28">
                          <Badge
                            variant="secondary"
                            className={badgeClassName}
                          >
                          {statusLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-40">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label={t("training.actions.acceptAria", {
                                name: trainingItem.user?.fullName ?? "",
                              })}
                              disabled={
                                updating || normalizedStatusKey === "CONFIRMED"
                              }
                              onClick={() => handleAccept(trainingItem.id)}
                              className="text-green-700 border-green-200 hover:bg-green-50"
                            >
                            <Check className="mr-1 h-4 w-4" />
                            {t("training.actions.accept")}
                            </Button>
                          <TrainingDetailsModal item={trainingItem} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {t("training.table.empty")}
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
        <CustomPagination2 currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default TrainingList;
