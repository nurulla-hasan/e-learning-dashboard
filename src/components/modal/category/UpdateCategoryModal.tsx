import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { NotebookText, Pencil } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { useUpdateCategoryMutation } from "@/redux/features/category/categoryApi";
import { useForm, type SubmitHandler } from "react-hook-form";
import { categorySchema } from "@/schema/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetCategoryUpdateError } from "@/redux/features/category/categorySlice";
import type z from "zod";
import type { ICategory } from "@/types/category.type";
import CustomIconInput from "@/components/form/CustomIconInput";
import ErrorAlert from "@/components/validation/ErrorAlert";
import FormButton from "@/components/form/FormButton";
import { useEffect, useState } from "react";

type TCategoryFormValues = z.infer<typeof categorySchema>;

type TProps = {
    category: ICategory
}

const UpdateCategoryModal = ({ category } : TProps) => {
    const [open, setOpen] = useState(false)
    const dispatch = useAppDispatch();
    const { CategoryUpdateError } = useAppSelector((state) => state.category);
    const [updateCategory, { isLoading, isSuccess }] = useUpdateCategoryMutation();
    const { handleSubmit, control } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name
        }
    });


    //if success
    useEffect(() => {
      if (!isLoading && isSuccess) {
        setOpen(false)
      }
    }, [isLoading, isSuccess, dispatch])

    const onSubmit: SubmitHandler<TCategoryFormValues> = (data) => {
        dispatch(SetCategoryUpdateError(""))
        updateCategory({
            id: category?.id,
            data
        })
    }


    return (
        <>
            <Button
                onClick={()=>setOpen(true)}
                size="icon"
                className="bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
                <Pencil className="h-3 w-3" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onOpenAutoFocus={(e)=>e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Update Category</DialogTitle>
                    </DialogHeader>
                    {CategoryUpdateError && <ErrorAlert message={CategoryUpdateError} />}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <CustomIconInput control={control} name="name" label="Name" placeholder="Enter name" icon={NotebookText} />
                        <FormButton isLoading={isLoading}>Save Change</FormButton>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}


export default UpdateCategoryModal