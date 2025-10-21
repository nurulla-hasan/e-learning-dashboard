"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import OrderDetailsModal from "../modal/order/OrderDetailsModal"
import { recentOrderData } from "@/data/order.data"




const RecentOrderList = () => {
    return (
        <div className="w-full mx-auto relative bg-white p-4 rounded-md mt-4 shadow">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                {/* Left Section: Title + Total Count */}
                <div className="flex justify-between items-center gap-3 w-full sm:w-auto">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Recent Order List</h1>
                </div>
            </div>


            {/* Table Container with Fixed Height and Scrolling */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
                <div className="relative">
                    {/* Single table container with synchronized scrolling */}
                    <div className="overflow-auto max-h-[500px]">
                        <Table className="min-w-[800px]">
                            <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                                <TableRow className="hover:bg-yellow-50">
                                    <TableHead className="w-16 bg-yellow-50">S.N.</TableHead>
                                    <TableHead className="min-w-32 bg-yellow-50">Order No.</TableHead>
                                    <TableHead className="min-w-32 bg-yellow-50">Student/Company Name</TableHead>
                                    <TableHead className="min-w-32 bg-yellow-50">Date</TableHead>
                                    <TableHead className="min-w-32 bg-yellow-50">Amount</TableHead>
                                    <TableHead className="min-w-32 bg-yellow-50">Invoice</TableHead>
                                    <TableHead className="min-w-32 bg-yellow-50">Payment Status</TableHead>
                                    <TableHead className="min-w-24 bg-yellow-50">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrderData.length > 0 ? (
                                    recentOrderData?.map((order, index) => (
                                        <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                                            <TableCell className="w-16 text-muted-foreground">{index + 1}</TableCell>
                                            <TableCell className="min-w-32 font-medium text-foreground">{order.orderNo}</TableCell>
                                            <TableCell className="min-w-32 font-medium text-foreground">{order.name}</TableCell>
                                            <TableCell className="min-w-32 font-medium text-foreground">{order.date}</TableCell>
                                            <TableCell className="min-w-32 font-medium text-foreground">${order.amount}</TableCell>
                                            <TableCell className="min-w-32 font-medium text-foreground">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-normal"
                                                >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Download
                                                </Button>
                                            </TableCell>
                                              <TableCell className="min-w-24">
                                                <button className={`px-3 py-1.5 border w-20 rounded-xl ${order?.paymentStatus==="Paid" ? "border-green-200 text-green-500" : "border-red-200 text-red-500"}`}>{order?.paymentStatus}</button>
                                            </TableCell>
                                            <TableCell className="min-w-24">
                                               <OrderDetailsModal/>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No Orders found matching your search.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default RecentOrderList;