import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { IContact } from "@/types/contact.type"
import ViewContactModal from "../modal/contact/ViewContactModal"
import CustomPagination from "../form/CustomPagination"
import type { IMeta } from "@/types/global.type"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"

type TProps = {
    contacts: IContact[],
    meta: IMeta,
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>
}

const ContactTable = ({ contacts, meta, currentPage, setCurrentPage, pageSize }: TProps) => {
  const { t } = useTranslation("common")
  return (
    <div className="space-y-4">
      <div className="border border-border rounded-xl bg-card">
        <ScrollArea className="w-[calc(100vw-64px)] lg:w-full overflow-hidden overflow-x-auto rounded-xl whitespace-nowrap">
          <Table className="min-w-[720px]">
            <TableHeader className="sticky top-0 z-10 bg-yellow-50 border-b">
              <TableRow>
                <TableHead>{t("common:contacts.table.headers.sn")}</TableHead>
                <TableHead>{t("common:contacts.table.headers.email")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("common:contacts.table.headers.message")}</TableHead>
                <TableHead>{t("common:contacts.table.headers.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts?.length > 0 ? (
                contacts?.map((contact, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}>
                    <TableCell>{Number(index + 1) + (meta?.page - 1) * pageSize}</TableCell>
                    <TableCell>{contact.userEmail}</TableCell>
                    <TableCell className="hidden sm:table-cell truncate">
                      {contact?.message || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {contact.status === "CLOSED" ? (
                          <Button disabled variant="outline" size="sm">
                            {t("common:contacts.table.closed")}
                          </Button>
                        ) : (
                          <ViewContactModal contact={contact} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    {t("common:contacts.table.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="fixed bottom-0 left-0 flex w-full bg-white border-t py-3">
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={meta?.totalPages}
          dataLength={contacts?.length}
        />
      </div>
    </div>
  )
}

export default ContactTable
