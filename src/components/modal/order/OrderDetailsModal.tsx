"use client";

import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

interface OrderInvoiceData {
  [key: string]: string | number | null | undefined;
}

interface OrderUserData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

interface OrderCourseData {
  courseThumbnail?: string;
  courseTitle?: string;
  title?: string;
  category?: { name?: string };
  instructorName?: string;
  certificate?: boolean;
  lifetimeAccess?: boolean;
  totalSections?: number;
  totalLessons?: number;
  totalDuration?: string;
  discountPrice?: number;
  price?: number;
}

interface OrderDetailsModalProps {
  order: {
    invoice?: OrderInvoiceData;
    invoiceId?: string;
    id?: string;
    user?: OrderUserData;
    userFullName?: string;
    enrolledAt?: string;
    totalAmount?: number | string;
    paymentStatus?: string;
    progress?: number;
    course?: OrderCourseData;
  };
}

const OrderDetailsModal = ({ order }: OrderDetailsModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation("common");

  // Sample order data matching the design
  const inv = (order?.invoice ?? {}) as OrderInvoiceData;
  const orderId =
    (inv["Invoice Number"] as string | undefined) || order?.invoiceId || order?.id || "#-";
  const customerName =
    (inv["Buyer"] as string | undefined) || order?.user?.fullName || order?.userFullName || "-";
  const email = (inv["Buyer Email"] as string | undefined) || order?.user?.email || "";
  const phoneNumber = order?.user?.phoneNumber || "";
  const orderDate =
    (inv["Invoice Date"] as string | undefined) ||
    (order?.enrolledAt ? new Date(order.enrolledAt).toLocaleDateString() : "-");
  const paymentStatus = order?.paymentStatus || "-";
  const courseName =
    inv["Course(s) Purchased"] ||
    order?.course?.courseTitle ||
    order?.course?.title ||
    "-";
  const courseAmountSource =
    inv["Course Price(s)"] ??
    order?.course?.discountPrice ??
    order?.course?.price ??
    order?.totalAmount ??
    "";
  const totalAmountSource =
    inv["Total Amount"] ??
    order?.totalAmount ??
    "";

  const formatAmount = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "number") {
      return `$${value.toFixed(2)}`;
    }
    const text = value.toString();
    return text.startsWith("$") ? text : `$${text}`;
  };

  const formattedCoursePrice = formatAmount(courseAmountSource);
  const formattedTotalAmount = formatAmount(totalAmountSource);
  const courses = [
    {
      name: courseName,
      price: formattedCoursePrice,
    },
  ];
  const orderData = {
    orderId,
    customerName,
    email,
    phoneNumber,
    orderDate,
    totalPrice: formattedTotalAmount,
    paymentStatus,
    courses,
    coursesTotal: formattedTotalAmount,
  };

  const course = (order?.course ?? {}) as OrderCourseData;
  const courseThumb = course?.courseThumbnail;
  const courseTitle = course?.courseTitle || course?.title;
  const courseCategory = course?.category?.name;
  const instructorName = course?.instructorName;
  const certificate = course?.certificate;
  const lifetimeAccess = course?.lifetimeAccess;
  const totalSections = course?.totalSections;
  const totalLessons = course?.totalLessons;
  const totalDuration = course?.totalDuration;
  const progress =
    typeof order?.progress === "number" ? `${order.progress}%` : undefined;

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        size="icon"
        className="bg-cyan-600 hover:bg-cyan-700 text-white"
        aria-label={t("orders.details.open")}
      >
        <Eye className="h-3 w-3" />
      </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <ScrollArea className="w-full h-[80vh]">
            <DialogHeader>
              <DialogTitle>{t("orders.details.title")}</DialogTitle>
              <DialogDescription className="sr-only">
                {t("orders.details.aria", { id: orderData.orderId })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Order Information */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t("orders.details.orderId")}
                  </span>
                  <span className="text-sm font-medium">
                    {orderData.orderId}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t("orders.details.customerName")}
                  </span>
                  <span className="text-sm font-medium">
                    {orderData.customerName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t("orders.details.email")}</span>
                  <span className="text-sm font-medium">{orderData.email}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t("orders.details.phone")}
                  </span>
                  <span className="text-sm font-medium">
                    {orderData.phoneNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t("orders.details.orderDate")}
                  </span>
                  <span className="text-sm font-medium">
                    {orderData.orderDate}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t("orders.details.totalPrice")}
                  </span>
                  <span className="text-sm font-medium">
                    {orderData.totalPrice}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t("orders.details.paymentStatus")}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {orderData.paymentStatus}
                  </span>
                </div>
                {progress && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("orders.details.progress")}
                    </span>
                    <span className="text-sm font-medium">{progress}</span>
                  </div>
                )}
              </div>

              {/* Purchased Courses Section */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">{t("orders.details.purchasedCourses")}</h3>

                {/* Course Headers */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("orders.details.courseName")}
                  </span>
                  <span className="text-sm text-muted-foreground">{t("orders.details.price")}</span>
                </div>

                {/* Course List */}
                <div className="space-y-2">
                  {orderData.courses.map((course, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{course.name}</span>
                      <span className="text-sm font-medium">
                        {course.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t mt-3">
                  <span className="text-sm font-medium">{t("orders.details.total")}</span>
                  <span className="text-sm font-medium">
                    {orderData.coursesTotal}
                  </span>
                </div>
              </div>

              {/* Course Details */}
              {(courseTitle || courseThumb) && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">{t("orders.details.courseDetails")}</h3>
                  <div className="flex items-start gap-3">
                    {courseThumb && (
                      <img
                        src={courseThumb}
                        alt={courseTitle || "Course thumbnail"}
                        className="w-16 h-16 rounded object-cover"
                      />
                    )}
                    <div className="space-y-1 text-sm">
                      {courseTitle && (
                        <div>
                          <span className="text-muted-foreground">{t("orders.details.titleLabel")}</span>{" "}
                          <span className="font-medium">{courseTitle}</span>
                        </div>
                      )}
                      {courseCategory && (
                        <div>
                          <span className="text-muted-foreground">
                            {t("orders.details.category")}
                          </span>{" "}
                          <span>{courseCategory}</span>
                        </div>
                      )}
                      {instructorName && (
                        <div>
                          <span className="text-muted-foreground">
                            {t("orders.details.instructor")}
                          </span>{" "}
                          <span>{instructorName}</span>
                        </div>
                      )}
                      {certificate !== undefined && (
                        <div>
                          <span className="text-muted-foreground">
                            {t("orders.details.certificate")}
                          </span>{" "}
                          <span>{certificate ? t("orders.details.yes") : t("orders.details.no")}</span>
                        </div>
                      )}
                      {lifetimeAccess !== undefined && (
                        <div>
                          <span className="text-muted-foreground">
                            {t("orders.details.lifetimeAccess")}
                          </span>{" "}
                          <span>{lifetimeAccess ? t("orders.details.yes") : t("orders.details.no")}</span>
                        </div>
                      )}
                      {totalSections !== undefined && (
                        <div>
                          <span className="text-muted-foreground">
                            {t("orders.details.sections")}
                          </span>{" "}
                          <span>{totalSections}</span>
                        </div>
                      )}
                      {totalLessons !== undefined && (
                        <div>
                          <span className="text-muted-foreground">
                            {t("orders.details.lessons")}
                          </span>{" "}
                          <span>{totalLessons}</span>
                        </div>
                      )}
                      {totalDuration !== undefined && (
                        <div>
                          <span className="text-muted-foreground">
                            {t("orders.details.duration")}
                          </span>{" "}
                          <span>{totalDuration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderDetailsModal;
