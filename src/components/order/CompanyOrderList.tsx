/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search } from "lucide-react";
import { Button } from "../ui/button";
import CustomPagination2 from "../../../tools/CustomPagination2";
import { useGetCompanyOrdersQuery } from "@/redux/features/order/orderApi";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import { useTranslation } from "react-i18next";

const useCompanyOrdersHook = (params: any, opts?: any) =>
  useGetCompanyOrdersQuery(params, opts);

const CompanyOrderList = () => {
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
  } = useSmartFetchHook<any>(useCompanyOrdersHook as any, {}, {});

  const handlePrint = (order: any) => {
    const invoiceId = order?.invoiceId || order?.id || "-";
    const date = order?.enrolledAt ? new Date(order.enrolledAt).toLocaleDateString() : new Date().toLocaleDateString();
    const buyer = order?.userFullName || order?.user?.fullName || "-";
    const amount = order?.coursePrice ?? order?.totalAmount ?? 0;

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${t("orders.invoice.company.title")} ${invoiceId}</title>
  <style>
    body{font-family:Arial, sans-serif; padding:24px; color:#111}
    .hdr{display:flex; justify-content:space-between; align-items:center; margin-bottom:16px}
    .title{font-size:20px; font-weight:700}
    table{width:100%; border-collapse:collapse; margin-top:16px}
    td,th{border:1px solid #ddd; padding:8px; text-align:left}
  </style>
</head>
<body>
  <div class="hdr">
    <div class="title">${t("orders.invoice.company.title")}</div>
    <div># ${invoiceId}</div>
  </div>
  <div>${t("orders.invoice.company.date")}: ${date}</div>
  <div>${t("orders.invoice.company.customer")}: ${buyer}</div>
  <table>
    <thead><tr><th>${t("orders.invoice.company.description")}</th><th>${t("orders.invoice.company.amount")}</th></tr></thead>
    <tbody>
      <tr><td>${t("orders.invoice.company.defaultDescription")}</td><td>${amount}</td></tr>
    </tbody>
  </table>
</body>
</html>`;

    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  if (isLoading) return <ListLoading />;
  if (isError) return <ServerErrorCard />;

  return (
    <div className="w-full mx-auto relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex justify-between items-center gap-3 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{t("orders.company.heading")}</h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">{t("orders.common.totalLabel")}</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">{total || 0}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("orders.common.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="border border-border rounded-lg bg-card overflow-hidden mt-4">
        <div className="relative">
          <div className="overflow-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                <TableRow className="hover:bg-yellow-50">
                  <TableHead className="w-16 bg-yellow-50">{t("orders.company.table.sn")}</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">{t("orders.company.table.orderNo")}</TableHead>
                  <TableHead className="min-w-40 bg-yellow-50">{t("orders.company.table.employee")}</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">{t("orders.company.table.date")}</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">{t("orders.company.table.amount")}</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">{t("orders.company.table.invoice")}</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">{t("orders.company.table.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  items.map((order: any, index: number) => (
                    <TableRow key={order?.id ?? index} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                      <TableCell className="w-16 text-muted-foreground">{index + 1 + ((page || 1) - 1) * (limit || 0)}</TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">{order?.invoiceId ?? order?.id ?? '-'}</TableCell>
                      <TableCell className="min-w-40 font-medium text-foreground">{order?.userFullName ?? order?.user?.fullName ?? '-'}</TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">{order?.enrolledAt ? new Date(order.enrolledAt).toLocaleDateString() : '-'}</TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">{order?.coursePrice ?? order?.totalAmount ?? '-'}</TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {order?.invoice ? (
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-normal" onClick={() => handlePrint(order)}>
                            <Download className="h-4 w-4 mr-1" />
                            {t("orders.common.download")}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="min-w-24">
                        <button className={`px-3 py-1.5 border w-28 rounded-xl ${
                          (order?.paymentStatus?.toUpperCase?.() === "PAID" || order?.paymentStatus?.toUpperCase?.() === "COMPLETED")
                            ? "border-green-200 text-green-600" : "border-red-200 text-red-600"}`}>{t(`orders.common.status.${order?.paymentStatus?.toLowerCase?.() || "unknown"}`, { defaultValue: order?.paymentStatus || t("orders.common.status.unknown") })}</button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{t("orders.company.empty")}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t py-3">
        <CustomPagination2 currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default CompanyOrderList;
