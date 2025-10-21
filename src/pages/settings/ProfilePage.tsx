"use client";

import ProfileForm from "@/components/profile/ProfileForm";
import ProfilePic from "@/components/profile/ProfilePic";
import { useState } from "react";

const ProfilePage = () => {
  const [file, setFile] = useState<File | null>(null)
  const user = {
    "fullName": "Admin Admin",
    "email": "admin@gmail.com",
    "phone": "01793837035",
    "profileImg": ""
  }

  return (
    <div className="min-h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Admin Profile</h1>
          <div className="flex justify-center mb-8">
            <div className="relative">
              <ProfilePic setFile={setFile} />
            </div>
          </div>
          <ProfileForm user={user} file={file} />
        </div>
      </div>
    </div>
  )
  //}
}

export default ProfilePage;