
import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const TrainingDetailsModal = ({ item }: { item: any }) => {
  const [open, setOpen] = useState(false);

  const trainee = item?.user || {};
  const course = item?.course || {};

  const createdAt = item?.createdAt
    ? new Date(item.createdAt).toLocaleString()
    : "-";

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-cyan-700 border-cyan-200 hover:bg-cyan-50"
      >
        <Eye className="h-4 w-4 mr-1" /> View
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <ScrollArea className="w-full">
            <DialogHeader>
              <DialogTitle>Training Details</DialogTitle>
              <DialogDescription className="sr-only">
                Training details for {trainee?.fullName || "-"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 p-1">
              {/* Training Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Training ID:</span><span>{item?.id || '-'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status:</span><span className="font-medium">{item?.status || '-'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Created At:</span><span>{createdAt}</span></div>
              </div>

              {/* Trainee */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Trainee</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Name:</span><span>{trainee?.fullName || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Email:</span><span>{trainee?.email || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span><span>{trainee?.phoneNumber || '-'}</span></div>
                </div>
              </div>

              {/* Course */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Course</h3>
                <div className="flex items-start gap-3">
                  {course?.courseThumbnail && (
                    <img
                      src={course.courseThumbnail}
                      alt={course?.courseTitle || 'Course thumbnail'}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="space-y-1 text-sm w-full">
                    <div className="flex justify-between"><span className="text-muted-foreground">Title:</span><span className="font-medium">{course?.courseTitle || '-'}</span></div>
                    {course?.category?.name && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Category:</span><span>{course.category.name}</span></div>
                    )}
                    {course?.instructorName && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Instructor:</span><span>{course.instructorName}</span></div>
                    )}
                    {course?.courseLevel && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Level:</span><span>{course.courseLevel}</span></div>
                    )}
                    {course?.price !== undefined && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Price:</span><span>{course.price}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrainingDetailsModal;
