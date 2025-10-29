import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAddEmployeeMutation, useGetAllCoursesAdminQuery } from "@/redux/features/order/orderApi";
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper";
import { useNavigate } from "react-router-dom";

interface TFormValues {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyVatId: string;
  companyPassword: string;
  courseId: string;
}

const CreateEmployeeForm = () => {
  const navigate = useNavigate();
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
      address: "",
      phoneNumber: "",
      companyName: "",
      companyEmail: "",
      companyAddress: "",
      companyVatId: "",
      companyPassword: "",
      courseId: "",
    },
  });

  const onSubmit = async (data: TFormValues) => {
    try {
      const payload = { ...data, status: "active" } as any;
      await addEmployee(payload).unwrap();
      SuccessToast("Employee created successfully");
      navigate("/employees");
    } catch (e: any) {
      ErrorToast(e?.data?.message || "Something Went Wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Employee</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="address"
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street, New York, NY 10001" {...field} />
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
                    <Input placeholder="+1-555-123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              rules={{ required: "Company name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Tech Solutions Ltd." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyEmail"
              rules={{ required: "Company email is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@techsolutions.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyPassword"
              rules={{ required: "Company password is required", minLength: { value: 8, message: "Minimum 8 characters" } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyAddress"
              rules={{ required: "Company address is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Address</FormLabel>
                  <FormControl>
                    <Input placeholder="456 Business Ave, San Francisco, CA 94105" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyVatId"
              rules={{ required: "VAT ID is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company VAT ID</FormLabel>
                  <FormControl>
                    <Input placeholder="US123456789" {...field} />
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => navigate("/employees")}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateEmployeeForm;
