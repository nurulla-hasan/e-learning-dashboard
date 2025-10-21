"use client"

import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"


const OrderDetailsModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

  // Sample order data matching the design
  const orderData = {
    orderId: "#7745634657",
    customerName: "Devon Lane",
    email: "csilvers@rizon.com",
    phoneNumber: "4364856856",
    orderDate: "14/03/25",
    totalPrice: "$67",
    paymentStatus: "Paid",
    courses: [
      {
        name: "Web Design & Development Fundamentals",
        price: "$55",
      },
      {
        name: "Graphic Design- Essential Training",
        price: "$125",
      },
    ],
    coursesTotal: "$180",
  }

  return (
    <>
      <Button
              onClick={() => setIsModalOpen(true)}
              size="icon"
              className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full"
          >
              <Eye className="h-3 w-3" />
          </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button> */}
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Information */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Order ID:</span>
              <span className="text-sm font-medium">{orderData.orderId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Customer Name:</span>
              <span className="text-sm font-medium">{orderData.customerName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="text-sm font-medium">{orderData.email}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Phone Number:</span>
              <span className="text-sm font-medium">{orderData.phoneNumber}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Order Date:</span>
              <span className="text-sm font-medium">{orderData.orderDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Price:</span>
              <span className="text-sm font-medium">{orderData.totalPrice}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Payment Status:</span>
              <span className="text-sm font-medium text-green-600">{orderData.paymentStatus}</span>
            </div>
          </div>

          {/* Purchased Courses Section */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-3">Purchased Courses:</h3>

            {/* Course Headers */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Course Name</span>
              <span className="text-sm text-muted-foreground">Price</span>
            </div>

            {/* Course List */}
            <div className="space-y-2">
              {orderData.courses.map((course, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{course.name}</span>
                  <span className="text-sm font-medium">{course.price}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-2 border-t mt-3">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-medium">{orderData.coursesTotal}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default OrderDetailsModal;
