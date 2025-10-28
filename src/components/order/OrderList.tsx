import { useState } from "react";
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

// Types for student orders based on provided schema
interface StudentInvoice {
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
}

interface StudentOrder {
  id: string;
  userId?: string;
  courseId?: string;
  progress?: number;
  paymentStatus?: string;
  totalAmount?: number;
  invoice?: StudentInvoice;
  invoiceId?: string;
  user?: { fullName?: string };
  course?: { title?: string; price?: number; discountPrice?: number };
  enrolledAt?: string;
}

const OrderList = () => {
  const [activeTab, setActiveTab] = useState<"student" | "company">("student");

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
  } = useSmartFetchHook<StudentOrder>(useStudentOrdersHook as any, {}, {}, { skip: activeTab !== "student" });
  
  const handlePrintStudent = (order: any) => {
    const inv = order?.invoice || {};
    const invoiceNumber = inv['Invoice Number'] || order?.invoiceId || order?.id || '-';
    const invoiceDate = inv['Invoice Date'] || (order?.enrolledAt ? new Date(order.enrolledAt).toLocaleDateString() : new Date().toLocaleDateString());
    const seller = inv['Seller'] || 'E-Learning';
    const sellerEmail = inv['Email'] || '';
    const sellerContact = inv['Contact Number'] || '';
    const sellerAddress = inv['Address'] || '';
    const buyer = inv['Buyer'] || order?.user?.fullName || '-';
    const buyerEmail = inv['Buyer Email'] || '';
    const buyerContact = inv['Buyer Contact Number'] || '';
    const buyerAddress = inv['Buyer Address'] || '';
    const courseName = inv['Course(s) Purchased'] || order?.course?.title || 'Course';
    const courseIds = inv['Course ID(s)'] || order?.courseId || '';
    const coursePrice = inv['Course Price(s)'] || (typeof order?.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order?.totalAmount || '0.00');
    const vatRate = inv['Course vat rate(s) included '] || '';
    const totalAmount = inv['Total Amount'] || coursePrice || '0.00';

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${invoiceNumber}</title>
  <style>
    body{font-family:Arial, sans-serif; padding:24px; color:#111}
    .hdr{display:flex; justify-content:space-between; align-items:center; margin-bottom:16px}
    .title{font-size:20px; font-weight:700}
    table{width:100%; border-collapse:collapse; margin-top:16px}
    td,th{border:1px solid #ddd; padding:8px; text-align:left}
    .grid{display:grid; grid-template-columns:1fr 1fr; gap:12px}
    .muted{color:#666}
  </style>
  </head>
  <body>
    <div class="hdr">
      <div class="title">Invoice</div>
      <div># ${invoiceNumber}</div>
    </div>
    <div class="grid">
      <div>
        <div><strong>Seller:</strong> ${seller}</div>
        <div class="muted">${sellerEmail}${sellerContact ? ' · '+sellerContact : ''}${sellerAddress ? ' · '+sellerAddress : ''}</div>
      </div>
      <div>
        <div><strong>Buyer:</strong> ${buyer}</div>
        <div class="muted">${buyerEmail}${buyerContact ? ' · '+buyerContact : ''}${buyerAddress ? ' · '+buyerAddress : ''}</div>
      </div>
    </div>
    <div style="margin-top:8px">Date: ${invoiceDate}</div>
    <table>
      <thead><tr><th>Description</th><th>Course ID(s)</th><th>VAT</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>${courseName}</td><td>${courseIds}</td><td>${vatRate}</td><td>${totalAmount}</td></tr>
      </tbody>
    </table>
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
          className={activeTab === "student" ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-muted text-foreground"}
          onClick={() => setActiveTab("student")}
        >
          Student Orders
        </Button>
        <Button
          variant="ghost"
          className={activeTab === "company" ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-muted text-foreground"}
          onClick={() => setActiveTab("company")}
        >
          Company Orders
        </Button>
      </div>

      {activeTab === "company" ? (
        <CompanyOrderList />
      ) : (
        <>
          {/* Student Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex justify-between items-center gap-3 w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Student Orders</h1>
              <div className="flex items-center">
                <span className="text-sm sm:text-base text-gray-600">Total:</span>
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">{studentTotal || 0}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search here..."
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
              <div className="border border-border rounded-lg bg-card overflow-hidden">
                <div className="relative">
                  <div className="overflow-auto">
                    <Table className="min-w-[800px]">
                      <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                        <TableRow className="hover:bg-yellow-50">
                          <TableHead className="w-16 bg-yellow-50">S.N.</TableHead>
                          <TableHead className="min-w-32 bg-yellow-50">Order No.</TableHead>
                          <TableHead className="min-w-40 bg-yellow-50">Student Name</TableHead>
                          <TableHead className="min-w-32 bg-yellow-50">Date</TableHead>
                          <TableHead className="min-w-32 bg-yellow-50">Amount</TableHead>
                          <TableHead className="min-w-32 bg-yellow-50">Invoice</TableHead>
                          <TableHead className="min-w-32 bg-yellow-50">Payment Status</TableHead>
                          <TableHead className="min-w-24 bg-yellow-50">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentItems.length > 0 ? (
                          studentItems.map((order: StudentOrder, index: number) => {
                            const inv = order?.invoice || {};
                            const invoiceNumber = inv['Invoice Number'] || order?.invoiceId || order?.id || '-';
                            const buyer = inv['Buyer'] || order?.user?.fullName || '-';
                            const invoiceDate = inv['Invoice Date'] || (order?.enrolledAt ? new Date(order.enrolledAt).toLocaleDateString() : '-');
                            const amount = inv['Total Amount'] || order?.totalAmount || order?.course?.price || order?.course?.discountPrice || '-';
                            return (
                              <TableRow key={order?.id ?? index} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                                <TableCell className="w-16 text-muted-foreground">{index + 1 + ((studentPage || 1) - 1) * (studentLimit || 0)}</TableCell>
                                <TableCell className="min-w-32 font-medium text-foreground">{invoiceNumber}</TableCell>
                                <TableCell className="min-w-40 font-medium text-foreground">{buyer}</TableCell>
                                <TableCell className="min-w-32 font-medium text-foreground">{invoiceDate}</TableCell>
                                <TableCell className="min-w-32 font-medium text-foreground">{amount}</TableCell>
                                <TableCell className="min-w-32 font-medium text-foreground">
                                  {order?.invoice ? (
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-normal" onClick={() => handlePrintStudent(order)}>
                                      <Download className="h-4 w-4 mr-1" />
                                      Download
                                    </Button>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="min-w-24">
                                  <button className={`px-3 py-1.5 border w-28 rounded-xl ${
                                    (order?.paymentStatus?.toUpperCase?.() === 'PAID' || order?.paymentStatus?.toUpperCase?.() === 'COMPLETED')
                                      ? 'border-green-200 text-green-600' : 'border-red-200 text-red-600'}`}>{order?.paymentStatus}
                                  </button>
                                </TableCell>
                                <TableCell className="min-w-24">
                                  <OrderDetailsModal order={order} />
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No Orders found matching your search.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <div className="fixed bottom-0 left-0 w-full bg-white border-t py-3">
                <CustomPagination2 currentPage={studentCurrentPage} totalPages={studentTotalPages} setCurrentPage={setStudentCurrentPage} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;
