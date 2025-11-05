"use client";

import ProfileForm from "@/components/profile/ProfileForm";
import ProfilePic from "@/components/profile/ProfilePic";
import { useState } from "react";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const [file, setFile] = useState<File | null>(null)
  const { isLoading } = useGetMeQuery({})
  const { t } = useTranslation("common")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader size={24} className="animate-spin text-cyan-500" />
          <div className="text-sm text-gray-600">{t("common:profile.loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Profile Picture Section */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8 pb-12">
            <div className="flex justify-center">
              <ProfilePic setFile={setFile} />
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{t("common:profile.accountSection.title")}</h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            </div>

            <ProfileForm file={file} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;