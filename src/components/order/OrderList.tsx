"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search } from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination"
import { orderData } from "@/data/order.data"
import { Button } from "../ui/button"
import OrderDetailsModal from "../modal/order/OrderDetailsModal"



const ITEMS_PER_PAGE = 10

const OrderList = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    // Filter orders based on search term
    const filteredOrders = orderData.filter(
        (order) =>
            order.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentOrders = filteredOrders.slice(startIndex, endIndex)

    // Reset to first page when search changes
    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    return (
        <div className="w-full mx-auto relative">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                {/* Left Section: Title + Total Count */}
                <div className="flex justify-between items-center gap-3 w-full sm:w-auto">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Order List</h1>
                    <div className="flex items-center">
                        <span className="text-sm sm:text-base text-gray-600">Total:</span>
                        <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
                            {filteredOrders.length || 0}
                        </span>
                    </div>
                </div>

                {/* Right Section: Search + Add New */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search here..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
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
                                {currentOrders.length > 0 ? (
                                    currentOrders?.map((order, index) => (
                                        <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                                            <TableCell className="w-16 text-muted-foreground">{startIndex + index + 1}</TableCell>
                                            <TableCell className="min-w-32 font-medium text-foreground">{order.orderNo}</TableCell>
                                            <TableCell className="min-w-32 font-medium text-foreground">{order.name}</TableCell>
                                            <TableCell className="min-w-32 font-medium text-foreground">{order.date}</TableCell>
                                            <TableCell className="min-w-32 font-medium text-foreground">{order.amount}</TableCell>
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

            {/* Fixed Pagination at bottom */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t py-3">
                <Pagination>
                    <PaginationContent className="justify-center">
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                aria-disabled={currentPage === 1}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={currentPage === page}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                aria-disabled={currentPage === totalPages}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

        </div>
    )
}


export default OrderList;