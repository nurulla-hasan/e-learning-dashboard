"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Search } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import DeleteCategoryModal from "../modal/category/DeleteCategoryModal"
import { testData } from "@/data/test.data"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"



const ITEMS_PER_PAGE = 10

const TestList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter users based on search term
  const filteredTests = testData.filter(
    (user) =>
      user.testName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTests = filteredTests.slice(startIndex, endIndex)

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
    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Test Builder List</h1>
    <div className="flex items-center">
      <span className="text-sm sm:text-base text-gray-600">Total:</span>
      <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
        {filteredTests.length || 0}
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

    <Button onClick={()=> navigate("/add-test")} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          Add New
     </Button>
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
                  <TableHead className="min-w-32 bg-yellow-50">Name</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">Course Name</TableHead>
                  <TableHead className="min-w-32 bg-yellow-50">Passing Score</TableHead>
                  <TableHead className="min-w-24 bg-yellow-50">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTests.length > 0 ? (
                  currentTests.map((user, index) => (
                    <TableRow key={user.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                      <TableCell className="w-16 text-muted-foreground">{startIndex + index + 1}</TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">{user.testName}</TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">{user.courseName}</TableCell>
                      <TableCell className="min-w-32 font-medium text-foreground">{user.passingScore}</TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex items-center gap-2">
                        <Button
                            onClick={()=> navigate(`/update-test/${user?.id}`)}
                            size="icon"
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                         <DeleteCategoryModal categoryId="id..."/>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No categories found matching your search.
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


export default TestList;