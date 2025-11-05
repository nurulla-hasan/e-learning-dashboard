/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [addEmployee, { isLoading }] = useAddEmployeeMutation();
  const { data: coursesRes, isLoading: coursesLoading } = useGetAllCoursesAdminQuery({} as any);
  const untitledCourseLabel = t("employees.form.defaults.untitledCourse");

  const courses: Array<{ id: string; title: string }> = useMemo(() => {
    const items = (coursesRes as any)?.data || (coursesRes as any)?.items || [];
    return Array.isArray(items)
      ? items.map((c: any) => ({ id: c.id, title: c.courseTitle || c.title || untitledCourseLabel }))
      : [];
  }, [coursesRes, untitledCourseLabel]);

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
      SuccessToast(t("employees.form.notifications.createSuccess"));
      navigate("/employees");
    } catch (e: any) {
      ErrorToast(e?.data?.message || t("employees.form.notifications.createError"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("employees.form.title")}</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>{t("employees.form.back")}</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              rules={{ required: t("employees.form.fields.fullName.required") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.fullName.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("employees.form.fields.fullName.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{ required: t("employees.form.fields.email.required") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.email.label")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t("employees.form.fields.email.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: t("employees.form.fields.password.required"),
                minLength: { value: 8, message: t("employees.form.fields.password.minLength") },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.password.label")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t("employees.form.fields.password.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              rules={{ required: t("employees.form.fields.dateOfBirth.required") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.dateOfBirth.label")}</FormLabel>
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
              rules={{ required: t("employees.form.fields.address.required") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.address.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("employees.form.fields.address.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              rules={{ required: t("employees.form.fields.phoneNumber.required") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.phoneNumber.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("employees.form.fields.phoneNumber.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              rules={{ required: t("employees.form.fields.companyName.required") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.companyName.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("employees.form.fields.companyName.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyEmail"
              rules={{ required: t("employees.form.fields.companyEmail.required") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.companyEmail.label")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t("employees.form.fields.companyEmail.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyPassword"
              rules={{
                required: t("employees.form.fields.companyPassword.required"),
                minLength: { value: 8, message: t("employees.form.fields.companyPassword.minLength") },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.companyPassword.label")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t("employees.form.fields.companyPassword.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyAddress"
              rules={{ required: t("employees.form.fields.companyAddress.required") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.companyAddress.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("employees.form.fields.companyAddress.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyVatId"
              rules={{ required: t("employees.form.fields.companyVatId.required") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.companyVatId.label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("employees.form.fields.companyVatId.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseId"
              rules={{ required: t("employees.form.fields.course.required") }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.form.fields.course.label")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            coursesLoading ? t("employees.form.fields.course.loading") : t("employees.form.fields.course.placeholder")
                          }
                        />
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
            <Button type="button" variant="ghost" onClick={() => navigate("/employees")}>
              {t("employees.form.actions.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {isLoading ? t("employees.form.actions.submitting") : t("employees.form.actions.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateEmployeeForm;
