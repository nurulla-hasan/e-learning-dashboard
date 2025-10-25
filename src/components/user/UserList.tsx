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
import { Search } from "lucide-react";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import { useGetUsersQuery } from "@/redux/features/user/userApi";
import type { IUser } from "@/types/user.type";

import CustomPagination2 from "../../../tools/CustomPagination2";
import ListLoading from "../loader/ListLoading";
import ServerErrorCard from "../card/ServerErrorCard";
import ToggleButton from "./ToggleButton";

const UserList = () => {
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
  } = useSmartFetchHook(useGetUsersQuery);

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
            User List
          </h1>
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-gray-600">Total:</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
              {total}
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
                  <TableHead className="min-w-32 bg-yellow-50">Name</TableHead>
                  <TableHead className="min-w-48 bg-yellow-50">Email</TableHead>
                  <TableHead className="min-w-32 hidden sm:table-cell bg-yellow-50">
                    Role
                  </TableHead>
                  <TableHead className="min-w-32 hidden sm:table-cell bg-yellow-50">
                    Created At
                  </TableHead>
                  <TableHead className="min-w-24 bg-yellow-50">
                    Status
                  </TableHead>
                  <TableHead className="min-w-24 bg-yellow-50">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length > 0 ? (
                  (items as IUser[])?.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                    >
                      <TableCell className="w-16 text-muted-foreground">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">
                        {user.fullName}
                      </TableCell>
                      <TableCell className="min-w-48 text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="min-w-32 text-muted-foreground hidden sm:table-cell">
                        {user.role}
                      </TableCell>
                      <TableCell className="min-w-32 text-muted-foreground hidden sm:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={
                              user.status === "BLOCKED"
                                ? "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                                : user.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
                                : "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            }
                          >
                            {user.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex items-center gap-2">
                          <ToggleButton user={user} />
                          
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found matching your search.
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
        <CustomPagination2
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default UserList;
