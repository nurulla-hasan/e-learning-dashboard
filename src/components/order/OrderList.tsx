/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search } from "lucide-react";
import { Button } from "../ui/button";
import OrderDetailsModal from "../modal/order/OrderDetailsModal";
import CustomPagination2 from "../../../tools/CustomPagination2";
import { useGetEnrolledStudentOrdersQuery } from "@/redux/features/order/orderApi";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import CompanyOrderList from "./CompanyOrderList";
import { useTranslation } from "react-i18next";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";

// Types for student orders based on provided schema
export interface StudentInvoice {
  Seller?: string;
  Email?: string;
  NIP?: string | null;
  "Contact Number"?: string;
  Address?: string | null;
  Buyer?: string;
  "Buyer Email"?: string;
  "Buyer NIP"?: string | null;
  "Buyer Contact Number"?: string;
  "Buyer Address"?: string;
  "Invoice Number"?: string;
  "Invoice Date"?: string;
  "Course(s) Purchased"?: string;
  "Course ID(s)"?: string;
  "Course Price(s)"?: string;
  "Course vat rate(s) included "?: string;
  "Total Amount"?: string;
  [key: string]: string | number | null | undefined;
}

export interface StudentOrder {
  id: string;
  userId?: string;
  courseId?: string;
  progress?: number;
  paymentStatus?: string;
  totalAmount?: number;
  invoice?: StudentInvoice;
  invoiceId?: string;
  user?: { fullName?: string; phoneNumber?: string };
  course?: {
    courseThumbnail?: string;
    courseTitle?: string;
    title?: string;
    price?: number;
    discountPrice?: number;
    category?: { name?: string };
    instructorName?: string;
    certificate?: boolean;
    lifetimeAccess?: boolean;
    totalSections?: number;
    totalLessons?: number;
    totalDuration?: string;
  };
  enrolledAt?: string;
}

const OrderList = () => {
  const [activeTab, setActiveTab] = useState<"student" | "company">("student");
  const { t } = useTranslation("common");

  // Wrapper hooks so useSmartFetchHook can pass object params but order APIs receive array params
  const useStudentOrdersHook = (params: any, opts?: any) =>
    useGetEnrolledStudentOrdersQuery(params, opts);

  // Student orders hook (skipped when company tab is active)
  const {
    searchTerm: studentSearchTerm,
    setSearchTerm: setStudentSearchTerm,
    currentPage: studentCurrentPage,
    setCurrentPage: setStudentCurrentPage,
    totalPages: studentTotalPages,
    total: studentTotal,
    page: studentPage,
    limit: studentLimit,
    items: studentItems,
    isLoading: studentLoading,
    isError: studentError,
  } = useSmartFetchHook<StudentOrder>(
    useStudentOrdersHook as any,
    {},
    {},
    { skip: activeTab !== "student" }
  );

  const invoiceStrings = useMemo(
    () => ({
      title: t("orders.invoice.student.title"),
      companyName: t("orders.invoice.student.companyName"),
      companyDetails: t("orders.invoice.student.companyDetails"),
      sellerHeading: t("orders.invoice.student.seller"),
      buyerHeading: t("orders.invoice.student.buyer"),
      invoiceNumber: t("orders.invoice.student.invoiceNumber"),
      invoiceDate: t("orders.invoice.student.invoiceDate"),
      description: t("orders.invoice.student.description"),
      courseIds: t("orders.invoice.student.courseIds"),
      vat: t("orders.invoice.student.vat"),
      amount: t("orders.invoice.student.amount"),
      total: t("orders.invoice.student.total"),
    }),
    [t]
  );

  const getPaymentStatusLabel = (status?: string) => {
    if (!status) return t("orders.common.status.unknown");
    const normalized = status.toLowerCase();
    if (normalized === "paid") return t("orders.common.status.paid");
    if (normalized === "completed") return t("orders.common.status.completed");
    if (normalized === "pending") return t("orders.common.status.pending");
    if (normalized === "cancelled" || normalized === "canceled")
      return t("orders.common.status.cancelled");
    return status;
  };

  const handlePrintStudent = (order: any) => {
    const inv = order?.invoice || {};
    const invoiceNumber =
      inv["Invoice Number"] || order?.invoiceId || order?.id || "-";
    const invoiceDate =
      inv["Invoice Date"] ||
      (order?.enrolledAt
        ? new Date(order.enrolledAt).toLocaleDateString()
        : new Date().toLocaleDateString());
    const seller = inv["Seller"] || invoiceStrings.companyName;
    const sellerEmail = inv["Email"] || "support@e-learning.com";
    const sellerContact = inv["Contact Number"] || "+1234567890";
    const sellerAddress = inv["Address"] || invoiceStrings.companyDetails;
    const buyer = inv["Buyer"] || order?.user?.fullName || "-";
    const buyerEmail = inv["Buyer Email"] || "";
    const buyerContact = inv["Buyer Contact Number"] || "";
    const buyerAddress = inv["Buyer Address"] || "";
    const courseName =
      inv["Course(s) Purchased"] ||
      order?.course?.title ||
      t("orders.invoice.student.defaultCourse");
    const courseIds = inv["Course ID(s)"] || order?.courseId || "";
    const coursePrice =
      inv["Course Price(s)"] ||
      (typeof order?.totalAmount === "number"
        ? order.totalAmount.toFixed(2)
        : order?.totalAmount || "0.00");
    const vatRate =
      inv["Course vat rate(s) included "] ||
      t("orders.invoice.student.defaultVat");
    const totalAmount = inv["Total Amount"] || coursePrice || "0.00";

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${invoiceStrings.title} ${invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    .company-info { text-align: center; margin-bottom: 40px; }
    .company-name { font-size: 28px; font-weight: bold; }
    .company-details { font-size: 14px; color: #777; }
    .invoice-header { display: flex; gap: 12px; justify-content: space-between; margin-bottom: 30px; }
    .party-info { width: 48%; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
    .party-info h3 { font-size: 18px; font-weight: bold; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-bottom: 10px; }
    .party-info div { margin-bottom: 5px; }
    .invoice-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .invoice-table th { background-color: #f7f7f7; }
    .invoice-details { margin-top: 20px; text-align: right; }
    .total { font-size: 18px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="company-info">
    <div class="company-name">${seller}</div>
    <div class="company-details">${sellerAddress} · ${sellerEmail} · ${sellerContact}</div>
  </div>

  <div class="invoice-header">
    <div class="party-info">
      <h3>${invoiceStrings.sellerHeading}</h3>
      <div><strong>${seller}</strong></div>
      <div>${sellerAddress}</div>
      <div>${sellerEmail}</div>
      <div>${sellerContact}</div>
    </div>
    <div class="party-info">
      <h3>${invoiceStrings.buyerHeading}</h3>
      <div><strong>${buyer}</strong></div>
      <div>${buyerAddress}</div>
      <div>${buyerEmail}</div>
      <div>${buyerContact}</div>
    </div>
  </div>

  <div class="invoice-details">
    <div><strong>${invoiceStrings.invoiceNumber}</strong> ${invoiceNumber}</div>
    <div><strong>${invoiceStrings.invoiceDate}</strong> ${invoiceDate}</div>
  </div>

  <table class="invoice-table">
    <thead>
      <tr>
        <th>${invoiceStrings.description}</th>
        <th>${invoiceStrings.courseIds}</th>
        <th>${invoiceStrings.vat}</th>
        <th>${invoiceStrings.amount}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${courseName}</td>
        <td>${courseIds}</td>
        <td>${vatRate}</td>
        <td>${totalAmount}</td>
      </tr>
    </tbody>
  </table>

  <div class="invoice-details">
    <div class="total">${invoiceStrings.total}: ${totalAmount}</div>
  </div>
</body>
</html>`;

    const w = window.open("", "_blank", "width=900,height=1000");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <div className="w-full mx-auto relative">
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          className={
            activeTab === "student"
              ? "bg-cyan-600 text-white hover:bg-cyan-700"
              : "bg-muted text-foreground"
          }
          onClick={() => setActiveTab("student")}
        >
          {t("orders.tabs.student")}
        </Button>
        <Button
          variant="ghost"
          className={
            activeTab === "company"
              ? "bg-cyan-600 text-white hover:bg-cyan-700"
              : "bg-muted text-foreground"
          }
          onClick={() => setActiveTab("company")}
        >
          {t("orders.tabs.company")}
        </Button>
      </div>

      {activeTab === "company" ? (
        <CompanyOrderList />
      ) : (
        <>
          {/* Student Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex justify-between items-center gap-3 w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {t("orders.student.heading")}
              </h1>
              <div className="flex items-center">
                <span className="text-sm sm:text-base text-gray-600">
                  {t("orders.common.totalLabel")}
                </span>
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
                  {studentTotal || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("orders.common.searchPlaceholder")}
                  value={studentSearchTerm}
                  onChange={(e) => setStudentSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {studentLoading ? (
            <ListLoading />
          ) : studentError ? (
            <ServerErrorCard />
          ) : (
            <>
              <ScrollArea className="w-[calc(100vw-60px)]  lg:w-full overflow-hidden overflow-x-auto rounded-xl whitespace-nowrap border border-border bg-card">
                <Table>
                  <TableHeader className="bg-yellow-50">
                    <TableRow>
                      <TableHead>
                        {t("orders.student.table.sn")}
                      </TableHead>
                      <TableHead>
                        {t("orders.student.table.orderNo")}
                      </TableHead>
                      <TableHead>
                        {t("orders.student.table.name")}
                      </TableHead>
                      <TableHead>
                        {t("orders.student.table.date")}
                      </TableHead>
                      <TableHead>
                        {t("orders.student.table.amount")}
                      </TableHead>
                      <TableHead>
                        {t("orders.student.table.invoice")}
                      </TableHead>
                      <TableHead>
                        {t("orders.student.table.status")}
                      </TableHead>
                      <TableHead className="text-end">
                        {t("orders.student.table.actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentItems.length > 0 ? (
                      studentItems.map((order: StudentOrder, index: number) => {
                        const inv = order?.invoice || {};
                        const invoiceNumber =
                          inv["Invoice Number"] ||
                          order?.invoiceId ||
                          order?.id ||
                          "-";
                        const buyer =
                          inv["Buyer"] || order?.user?.fullName || "-";
                        const invoiceDate =
                          inv["Invoice Date"] ||
                          (order?.enrolledAt
                            ? new Date(order.enrolledAt).toLocaleDateString()
                            : "-");
                        const amount =
                          inv["Total Amount"] ||
                          order?.totalAmount ||
                          order?.course?.price ||
                          order?.course?.discountPrice ||
                          "-";
                        return (
                          <TableRow
                            key={order?.id ?? index}
                            className={
                              index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"
                            }
                          >
                            <TableCell>
                              {index +
                                1 +
                                ((studentPage || 1) - 1) * (studentLimit || 0)}
                            </TableCell>
                            <TableCell>
                              {invoiceNumber}
                            </TableCell>
                            <TableCell>
                              {buyer}
                            </TableCell>
                            <TableCell>
                              {invoiceDate}
                            </TableCell>
                            <TableCell>
                              {amount}
                            </TableCell>
                            <TableCell>
                              {order?.invoice ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => handlePrintStudent(order)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  {t("orders.common.download")}
                                </Button>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`rounded-xl ${
                                  order?.paymentStatus?.toUpperCase?.() ===
                                    "PAID" ||
                                  order?.paymentStatus?.toUpperCase?.() ===
                                    "COMPLETED"
                                    ? "border-green-200 text-green-600"
                                    : "border-red-200 text-red-600"
                                }`}
                              >
                                {getPaymentStatusLabel(order?.paymentStatus)}
                              </Badge>
                            </TableCell>
                            <TableCell className="flex justify-end">
                              <OrderDetailsModal order={order} />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground"
                        >
                          {t("orders.student.empty")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <div className="fixed bottom-0 left-0 w-full bg-white border-t py-3">
                <CustomPagination2
                  currentPage={studentCurrentPage}
                  totalPages={studentTotalPages}
                  setCurrentPage={setStudentCurrentPage}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;
