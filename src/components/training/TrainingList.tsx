import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Check } from "lucide-react";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import { useGetTrainingOrdersQuery, useUpdateTrainingOrderMutation } from "@/redux/features/training/trainingApi";

import CustomPagination2 from "../../../tools/CustomPagination2";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import { Button } from "../ui/button";
import TrainingDetailsModal from "@/components/modal/training/TrainingDetailsModal";

interface TrainingItem {
  id: string;
  status: string;
  createdAt?: string;
  user?: { fullName?: string; email?: string; phoneNumber?: string };
  course?: { courseTitle?: string; price?: number; category?: { name?: string } };
}

const TrainingList = () => {
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
    } catch {}
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
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Training Management</h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">Total:</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">{total || 0}</span>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search trainings..."
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
                  <TableHead className="w-16 bg-yellow-50">S.N.</TableHead>
                  <TableHead className="min-w-44 bg-yellow-50">Trainee</TableHead>
                  <TableHead className="min-w-56 bg-yellow-50">Email</TableHead>
                  <TableHead className="min-w-48 bg-yellow-50">Course</TableHead>
                  <TableHead className="min-w-28 bg-yellow-50">Price</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">Created</TableHead>
                  <TableHead className="min-w-28 bg-yellow-50">Status</TableHead>
                  <TableHead className="min-w-40 bg-yellow-50">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length ? (
                  (items as TrainingItem[]).map((t, index) => (
                    <TableRow key={t.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                      <TableCell className="w-16 text-muted-foreground">{index + 1 + ((page || 1) - 1) * (limit || 0)}</TableCell>
                      <TableCell className="min-w-44 font-medium text-foreground">{t.user?.fullName || '-'}</TableCell>
                      <TableCell className="min-w-56 text-muted-foreground">{t.user?.email || '-'}</TableCell>
                      <TableCell className="min-w-48 text-foreground">{t.course?.courseTitle || '-'}</TableCell>
                      <TableCell className="min-w-28 text-foreground">{t.course?.price ?? '-'}</TableCell>
                      <TableCell className="min-w-32 text-muted-foreground">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-'}</TableCell>
                      <TableCell className="min-w-28">
                        <Badge
                          variant="secondary"
                          className={
                            t.status === 'CONFIRMED'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200'
                              : t.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200'
                          }
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-40">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={updating || t.status === 'CONFIRMED'}
                            onClick={() => handleAccept(t.id)}
                            className="text-green-700 border-green-200 hover:bg-green-50"
                          >
                            <Check/> Accept
                          </Button>
                          <TrainingDetailsModal item={t} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No trainings found matching your search.
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
