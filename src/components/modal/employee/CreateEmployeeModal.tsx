import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useAddEmployeeMutation, useGetAllCoursesAdminQuery } from "@/redux/features/order/orderApi";
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface TFormValues {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phoneNumber: string;
  courseId: string;
}

const CreateEmployeeModal = () => {
  const [open, setOpen] = useState(false);
  const [addEmployee, { isLoading }] = useAddEmployeeMutation();
  const { data: coursesRes, isLoading: coursesLoading } = useGetAllCoursesAdminQuery({} as any);

  const courses: Array<{ id: string; title: string }> = useMemo(() => {
    const items = (coursesRes as any)?.data || (coursesRes as any)?.items || [];
    return Array.isArray(items)
      ? items.map((c: any) => ({ id: c.id, title: c.courseTitle || c.title || "Untitled" }))
      : [];
  }, [coursesRes]);

  const form = useForm<TFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      dateOfBirth: "",
      phoneNumber: "",
      courseId: "",
    },
  });

  const onSubmit = async (data: TFormValues) => {
    try {
      await addEmployee(data as any).unwrap();
      SuccessToast("Employee created successfully");
      setOpen(false);
      form.reset();
    } catch (e:any) {
      ErrorToast(e?.data?.message || "Something Went Wrong");
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">Create Employee</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Create Employee</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  rules={{ required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  rules={{ required: "Date of birth is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courseId"
                  rules={{ required: "Course is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select course"} />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  {isLoading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEmployeeModal;
