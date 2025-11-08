import { useTranslation } from "react-i18next"
import type { ICategory } from "@/types/category.type"
import DeleteCategoryModal from "../modal/category/DeleteCategoryModal"
import UpdateCategoryModal from "../modal/category/UpdateCategoryModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


type TCategoryTableProps = {
    categories: ICategory[]
}


const CategoryTable = ({ categories }: TCategoryTableProps) => {
  const { t } = useTranslation("common");
  return (
    <>
      <ScrollArea className="w-[calc(100vw-60px)]  lg:w-full overflow-hidden overflow-x-auto rounded-xl whitespace-nowrap">
        <Table>
          <TableHeader className="bg-yellow-50">
            <TableRow>
              <TableHead>{t("common:categories.table.headers.sn")}</TableHead>
              <TableHead>{t("common:categories.table.headers.name")}</TableHead>
              <TableHead className="text-center">{t("common:categories.table.headers.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.length > 0 ? (
              categories.map((category, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-muted/30"}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category?.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <UpdateCategoryModal category={category} />
                      <DeleteCategoryModal categoryId={category?.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {t("common:categories.table.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}

export default CategoryTable