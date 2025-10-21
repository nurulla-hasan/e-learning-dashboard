import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { IContact } from "@/types/contact.type"
import ViewContactModal from "../modal/contact/ViewContactModal"
import CustomPagination from "../form/CustomPagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import type { IMeta } from "@/types/global.type"

type TProps = {
    contacts: IContact[],
    meta: IMeta,
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>
}

const ContactTable = ({ contacts, meta, currentPage, setCurrentPage, pageSize, setPageSize }: TProps) => {

  return (
    <>
       <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="relative">
          {/* Single table container with synchronized scrolling */}
          <div className="overflow-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
                <TableRow className="hover:bg-yellow-50">
                  <TableHead className="w-16 bg-yellow-50">S.N.</TableHead>
                  <TableHead className="min-w-48 bg-yellow-50">Email</TableHead>
                  <TableHead className="min-w-32 hidden sm:table-cell bg-yellow-50">Message</TableHead>
                  <TableHead className="min-w-24 bg-yellow-50">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts?.length > 0 ? (
                  contacts?.map((contact, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                      <TableCell className="w-16 text-muted-foreground">{Number(index + 1) + (meta?.page - 1) * pageSize}</TableCell>
                      <TableCell className="min-w-48 text-muted-foreground">{contact.userEmail}</TableCell>
                      <TableCell className="min-w-32 text-muted-foreground hidden sm:table-cell truncate">
                        {contact?.message || "-"}
                      </TableCell>
                      <TableCell className="min-w-24">
                        <div className="flex gap-2">
                          <ViewContactModal contact={contact} />
                          {/* {contact?.replyText ? (
                            <button className="bg-blue-300 hover:bg-blue-400 p-2 text-white rounded-full cursor-not-allowed">
                              <Reply size={18} />
                            </button>
                          ) : (
                            <ReplyModal contactId={contact?._id.toString()} />
                          )} */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No contacts found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 flex left-0 w-full bg-white border-t py-3">
        <CustomPagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={meta?.totalPages} dataLength={contacts?.length} />
        {meta?.total > 50 && (
          <div className="flex flex-1 justify-end">
            <Select value={pageSize.toString()} aria-label="Results per page" onValueChange={(val) => {
              setCurrentPage(1)
              setPageSize(Number(val));
            }}>
              <SelectTrigger
                id="results-per-page"
                className="w-fit whitespace-nowrap"
              >
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </>
  )
}

export default ContactTable
