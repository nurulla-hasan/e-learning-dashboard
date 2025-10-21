import { useUpdateUserStatusMutation } from "@/redux/features/user/userApi";
import { Loader } from "lucide-react";
import { Lock, LockOpen, Clock } from "lucide-react";
import type { IUser } from "@/types/user.type";
import { Button } from "../ui/button";

const ToggleButton = ({user}: {user: IUser}) => {
  const [updateUserStatus, { isLoading: updateStatusLoading }] =
    useUpdateUserStatusMutation();

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await updateUserStatus({ userId }).unwrap();
    } catch {
    //   console.log("Failed to update user status:", error);
    }
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-7 w-7 p-0 rounded-full transition-colors ${
        updateStatusLoading
          ? "cursor-not-allowed opacity-50"
          : user.status === "BLOCKED"
          ? "text-red-600 hover:text-red-700 hover:bg-red-50"
          : user.status === "PENDING"
          ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          : "text-green-600 hover:text-green-700 hover:bg-green-50"
      }`}
      onClick={() => handleToggleUserStatus(user.id)}
      disabled={updateStatusLoading}
      title={
        updateStatusLoading
          ? "Updating user status..."
          : user.status === "BLOCKED"
          ? "Unblock user"
          : user.status === "PENDING"
          ? "Approve user"
          : "Block user"
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
  );
};

export default ToggleButton;
