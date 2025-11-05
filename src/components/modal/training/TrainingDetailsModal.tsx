
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
import { useTranslation } from "react-i18next";

interface TrainingDetailsUser {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

interface TrainingDetailsCourse {
  courseThumbnail?: string;
  courseTitle?: string;
  category?: { name?: string };
  instructorName?: string;
  courseLevel?: string;
  price?: number;
}

interface TrainingDetailsItem {
  id?: string;
  status?: string;
  createdAt?: string;
  user?: TrainingDetailsUser;
  course?: TrainingDetailsCourse;
}

interface TrainingDetailsModalProps {
  item: TrainingDetailsItem;
}

const TrainingDetailsModal = ({ item }: TrainingDetailsModalProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("common");

  const trainee = item?.user || {};
  const course = item?.course || {};

  const createdAt = item?.createdAt
    ? new Date(item.createdAt).toLocaleString()
    : "-";

  const normalizedStatusKey = (item?.status || "UNKNOWN").toUpperCase();
  const statusLabel = t(`training.status.${normalizedStatusKey}`, {
    defaultValue: item?.status || t("training.status.UNKNOWN"),
  });

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-cyan-700 border-cyan-200 hover:bg-cyan-50"
        aria-label={t("training.details.open")}
      >
        <Eye className="h-4 w-4 mr-1" />
        {t("training.details.open")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <ScrollArea className="w-full">
            <DialogHeader>
              <DialogTitle>{t("training.details.title")}</DialogTitle>
              <DialogDescription className="sr-only">
                {t("training.details.description", {
                  name: trainee?.fullName || "-",
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 p-1">
              {/* Training Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("training.details.info.id")}
                  </span>
                  <span>{item?.id || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("training.details.info.status")}
                  </span>
                  <span className="font-medium">{statusLabel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("training.details.info.created")}
                  </span>
                  <span>{createdAt}</span>
                </div>
              </div>

              {/* Trainee */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">
                  {t("training.details.trainee.title")}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("training.details.trainee.name")}
                    </span>
                    <span>{trainee?.fullName || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("training.details.trainee.email")}
                    </span>
                    <span>{trainee?.email || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("training.details.trainee.phone")}
                    </span>
                    <span>{trainee?.phoneNumber || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Course */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">
                  {t("training.details.course.title")}
                </h3>
                <div className="flex items-start gap-3">
                  {course?.courseThumbnail && (
                    <img
                      src={course.courseThumbnail}
                      alt={course?.courseTitle || t("training.details.course.name")}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="space-y-1 text-sm w-full">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("training.details.course.name")}
                      </span>
                      <span className="font-medium">
                        {course?.courseTitle || "-"}
                      </span>
                    </div>
                    {course?.category?.name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("training.details.course.category")}
                        </span>
                        <span>{course.category.name}</span>
                      </div>
                    )}
                    {course?.instructorName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("training.details.course.instructor")}
                        </span>
                        <span>{course.instructorName}</span>
                      </div>
                    )}
                    {course?.courseLevel && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("training.details.course.level")}
                        </span>
                        <span>{course.courseLevel}</span>
                      </div>
                    )}
                    {course?.price !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("training.details.course.price")}
                        </span>
                        <span>{course.price}</span>
                      </div>
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
