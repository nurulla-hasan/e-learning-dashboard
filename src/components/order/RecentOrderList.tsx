"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetContactDataQuery } from "@/redux/features/dashboard/dashboardApi";
import { ScrollArea } from "../ui/scroll-area";
import { useTranslation } from "react-i18next";




const RecentOrderList = () => {
    const { data, isLoading, isError } = useGetContactDataQuery(undefined);
    const { t } = useTranslation("common");
    const contacts = (data?.data || []) as Array<{
        id: string;
        message: string;
        userEmail: string;
        userPhone: string;
        status: string;
        createdAt: string;
        totalReplies?: number;
    }>;
    return (
        <div className="w-full mx-auto relative bg-white p-4 rounded-md mt-4 shadow">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                {/* Left Section: Title + Total Count */}
                <div className="flex justify-between items-center gap-3 w-full sm:w-auto">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{t("dashboard.contacts.title")}</h1>
                </div>
            </div>


            {/* Table Container with Fixed Height and Scrolling */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
                <div className="relative">
                    {/* Single table container with synchronized scrolling */}
                    <ScrollArea className="overflow-auto max-h-[500px]">
                        <Table className="min-w-[800px]">
                            <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                                <TableRow className="hover:bg-yellow-50">
                                    <TableHead className="w-16 bg-yellow-50">{t("dashboard.contacts.columns.sn")}</TableHead>
                                    <TableHead className="min-w-48 bg-yellow-50">{t("dashboard.contacts.columns.email")}</TableHead>
                                    <TableHead className="min-w-40 bg-yellow-50">{t("dashboard.contacts.columns.phone")}</TableHead>
                                    <TableHead className="min-w-64 bg-yellow-50">{t("dashboard.contacts.columns.message")}</TableHead>
                                    <TableHead className="min-w-40 bg-yellow-50">{t("dashboard.contacts.columns.created")}</TableHead>
                                    {/* <TableHead className="min-w-32 bg-yellow-50">Status</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(6)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="w-16 text-muted-foreground">
                                                <div className="h-4 w-6 bg-gray-100 animate-pulse rounded" />
                                            </TableCell>
                                            <TableCell><div className="h-4 w-48 bg-gray-100 animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-32 bg-gray-100 animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-64 bg-gray-100 animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-40 bg-gray-100 animate-pulse rounded" /></TableCell>
                                            {/* <TableCell><div className="h-6 w-20 bg-gray-100 animate-pulse rounded-xl" /></TableCell> */}
                                        </TableRow>
                                    ))
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-red-500">{t("dashboard.contacts.error")}</TableCell>
                                    </TableRow>
                                ) : contacts.length > 0 ? (
                                    contacts.slice(0,5).map((c, index) => (
                                        <TableRow key={c.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                                            <TableCell className="w-16 text-muted-foreground">{index + 1}</TableCell>
                                            <TableCell className="min-w-48 font-medium text-foreground">{c.userEmail}</TableCell>
                                            <TableCell className="min-w-40 font-medium text-foreground">{c.userPhone || '-'}</TableCell>
                                            <TableCell className="min-w-64 font-medium text-foreground truncate">{c.message}</TableCell>
                                            <TableCell className="min-w-40 font-medium text-foreground">{new Date(c.createdAt).toLocaleString()}</TableCell>
                                            {/* <TableCell className="min-w-32">
                                                <button className={`px-3 py-1.5 border w-28 rounded-xl ${c.status === "CLOSED" ? "border-gray-200 text-gray-600" : c.status === "IN_PROGRESS" ? "border-yellow-200 text-yellow-600" : "border-green-200 text-green-500"}`}>{c.status}</button>
                                            </TableCell> */}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {t("dashboard.contacts.empty")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}


export default RecentOrderList;