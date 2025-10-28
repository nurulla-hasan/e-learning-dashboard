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

const OrderDetailsModal = ({ order }: { order: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample order data matching the design
  const inv = order?.invoice || {};
  const orderId =
    inv["Invoice Number"] || order?.invoiceId || order?.id || "#-";
  const customerName =
    inv["Buyer"] || order?.user?.fullName || order?.userFullName || "-";
  const email = inv["Buyer Email"] || order?.user?.email || "";
  const phoneNumber = order?.user?.phoneNumber || "";
  const orderDate =
    inv["Invoice Date"] ||
    (order?.enrolledAt ? new Date(order.enrolledAt).toLocaleDateString() : "-");
  const totalPrice =
    inv["Total Amount"] ||
    (typeof order?.totalAmount === "number"
      ? `$${order.totalAmount}`
      : order?.totalAmount || "");
  const paymentStatus = order?.paymentStatus || "-";
  const courseName =
    inv["Course(s) Purchased"] ||
    order?.course?.courseTitle ||
    order?.course?.title ||
    "-";
  const coursePrice =
    inv["Course Price(s)"] ||
    (order?.course?.discountPrice ??
      order?.course?.price ??
      order?.totalAmount ??
      "");
  const courses = [
    {
      name: courseName,
      price:
        typeof coursePrice === "number" ? `$${coursePrice}` : `${coursePrice}`,
    },
  ];
  const coursesTotal =
    inv["Total Amount"] ||
    (typeof order?.totalAmount === "number"
      ? `$${order.totalAmount}`
      : `${order?.totalAmount || ""}`);
  const orderData = {
    orderId,
    customerName,
    email,
    phoneNumber,
    orderDate,
    totalPrice: totalPrice
      ? String(totalPrice).startsWith("$")
        ? String(totalPrice)
        : `$${totalPrice}`
      : "",
    paymentStatus,
    courses,
    coursesTotal: coursesTotal
      ? String(coursesTotal).startsWith("$")
        ? String(coursesTotal)
        : `$${coursesTotal}`
      : "",
  };

  const course = order?.course || {};
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
      >
        <Eye className="h-3 w-3" />
      </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <ScrollArea className="w-full h-[80vh]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription className="sr-only">
                Order details for order {orderData.orderId}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Order Information */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Order ID:
                  </span>
                  <span className="text-sm font-medium">
                    {orderData.orderId}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Customer Name:
                  </span>
                  <span className="text-sm font-medium">
                    {orderData.customerName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm font-medium">{orderData.email}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Phone Number:
                  </span>
                  <span className="text-sm font-medium">
                    {orderData.phoneNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Order Date:
                  </span>
                  <span className="text-sm font-medium">
                    {orderData.orderDate}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Price:
                  </span>
                  <span className="text-sm font-medium">
                    {orderData.totalPrice}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Payment Status:
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {orderData.paymentStatus}
                  </span>
                </div>
                {progress && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Progress:
                    </span>
                    <span className="text-sm font-medium">{progress}</span>
                  </div>
                )}
              </div>

              {/* Purchased Courses Section */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Purchased Courses:</h3>

                {/* Course Headers */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Course Name
                  </span>
                  <span className="text-sm text-muted-foreground">Price</span>
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
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-medium">
                    {orderData.coursesTotal}
                  </span>
                </div>
              </div>

              {/* Course Details */}
              {(courseTitle || courseThumb) && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Course Details</h3>
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
                          <span className="text-muted-foreground">Title:</span>{" "}
                          <span className="font-medium">{courseTitle}</span>
                        </div>
                      )}
                      {courseCategory && (
                        <div>
                          <span className="text-muted-foreground">
                            Category:
                          </span>{" "}
                          <span>{courseCategory}</span>
                        </div>
                      )}
                      {instructorName && (
                        <div>
                          <span className="text-muted-foreground">
                            Instructor:
                          </span>{" "}
                          <span>{instructorName}</span>
                        </div>
                      )}
                      {certificate !== undefined && (
                        <div>
                          <span className="text-muted-foreground">
                            Certificate:
                          </span>{" "}
                          <span>{certificate ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {lifetimeAccess !== undefined && (
                        <div>
                          <span className="text-muted-foreground">
                            Lifetime Access:
                          </span>{" "}
                          <span>{lifetimeAccess ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {totalSections !== undefined && (
                        <div>
                          <span className="text-muted-foreground">
                            Sections:
                          </span>{" "}
                          <span>{totalSections}</span>
                        </div>
                      )}
                      {totalLessons !== undefined && (
                        <div>
                          <span className="text-muted-foreground">
                            Lessons:
                          </span>{" "}
                          <span>{totalLessons}</span>
                        </div>
                      )}
                      {totalDuration !== undefined && (
                        <div>
                          <span className="text-muted-foreground">
                            Duration:
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
