import { FaCamera } from "react-icons/fa";
import profile_placeholder from "../../assets/images/profile_placeholder.png";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateProfileImageMutation } from "@/redux/features/user/userApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useTranslation } from "react-i18next";

type TProps = {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

const ProfilePic = ({ setFile }: TProps) => {
  const [imageSrc, setImageSrc] = useState(profile_placeholder);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [updateProfileImage, { isLoading }] = useUpdateProfileImageMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation("common");

  const user = useSelector((state: RootState) => state.user.user);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setPendingFile(file);
      setFile(file);
    }
  };

  const handleCancel = () => {
    setPendingFile(null);
    setFile(null);
    setImageSrc(user?.image || profile_placeholder);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    const fd = new FormData();
    fd.append("profileImage", pendingFile);
    try {
      await updateProfileImage(fd).unwrap();
      setPendingFile(null);
    } catch {
      // errors are toasted in API layer
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <div className="relative w-28 h-28 group">
        {/* Profile Image Container */}
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={user?.image || imageSrc}
            alt={t("common:profile.picture.alt")}
            onError={() => setImageSrc(profile_placeholder)}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />

          {/* Camera Button Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="bg-white rounded-full p-2">
              <FaCamera className="text-gray-700 text-lg" />
            </div>
          </div>

          {/* Hidden file input trigger */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 cursor-pointer"
          />
        </div>

        {/* Status Indicator */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      {pendingFile && (
        <div className="mt-3 ml-3 flex items-center gap-2 justify-center">
          <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isLoading} className="text-xs px-3 py-1">
            {t("common:profile.picture.cancel")}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleUpload}
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xs px-3 py-1"
          >
            {isLoading ? t("common:profile.picture.updating") : t("common:profile.picture.update")}
          </Button>
        </div>
      )}
    </>
  );
};

export default ProfilePic;
