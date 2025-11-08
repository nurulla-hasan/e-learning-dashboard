import { useUpdateUserStatusMutation } from "@/redux/features/user/userApi";
import { Loader, Lock, LockOpen, Clock } from "lucide-react";
import type { IUser } from "@/types/user.type";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

const ToggleButton = ({ user }: { user: IUser }) => {
  const { t } = useTranslation("common");
  const [updateUserStatus, { isLoading: updateStatusLoading }] =
    useUpdateUserStatusMutation();

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await updateUserStatus({ userId }).unwrap();
    } catch {
      // console.log("Failed to update user status:", error);
    }
  };

  const getIntentText = () => {
    if (user.status === "BLOCKED") {
      return t("users.actions.unblock", { defaultValue: "Unblock user" });
    }
    if (user.status === "PENDING") {
      return t("users.actions.approve", { defaultValue: "Approve user" });
    }
    return t("users.actions.block", { defaultValue: "Block user" });
  };

  const getDescription = () => {
    if (user.status === "BLOCKED") {
      return t("users.actions.unblockConfirm", {
        defaultValue:
          "This will allow the user to regain platform access. Continue?",
      });
    }
    if (user.status === "PENDING") {
      return t("users.actions.approveConfirm", {
        defaultValue:
          "Once approved, the user will have full access. Proceed with approval?",
      });
    }
    return t("users.actions.blockConfirm", {
      defaultValue:
        "Blocking will prevent this user from accessing the platform. Are you sure?",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full transition-colors ${
            updateStatusLoading
              ? "cursor-not-allowed opacity-50"
              : user.status === "BLOCKED"
              ? "text-red-600 hover:text-red-700 hover:bg-red-50"
              : user.status === "PENDING"
              ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              : "text-green-600 hover:text-green-700 hover:bg-green-50"
          }`}
          disabled={updateStatusLoading}
          title={
            updateStatusLoading
              ? t("users.actions.updating", {
                  defaultValue: "Updating user status...",
                })
              : getIntentText()
          }
        >
          {updateStatusLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : user.status === "BLOCKED" ? (
            <Lock className="h-4 w-4" />
          ) : user.status === "PENDING" ? (
            <Clock className="h-4 w-4" />
          ) : (
            <LockOpen className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{getIntentText()}</AlertDialogTitle>
          <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={updateStatusLoading}>
            {t("common.actions.cancel", { defaultValue: "Cancel" })}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={updateStatusLoading}
            onClick={() => handleToggleUserStatus(user.id)}
          >
            {updateStatusLoading
              ? t("users.actions.updating", {
                  defaultValue: "Updating...",
                })
              : getIntentText()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ToggleButton;
