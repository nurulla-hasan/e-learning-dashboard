"use client";

import ChangePasswordForm from "../../components/auth/ChangePasswordForm";

const ChangePasswordPage = () => {
  return (
    <div className="min-h-full w-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Change Password
          </h1>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
