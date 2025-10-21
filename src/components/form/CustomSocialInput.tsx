/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Controller } from "react-hook-form";

type TProps = {
  children: React.ReactNode;
  name: string;
  control: any;
  placeholder?: string;
};

const CustomSocialInput = ({ name, children, control, placeholder="Profile link/url..." }: TProps) => {
  return (
    <>
      <div className="space-y-1">
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <>
              <div className="flex items-center">
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center justify-between w-[120px] px-3 py-2 border border-gray-300 rounded-l-md bg-white text-sm"
                  >
                    <span className="flex items-center">
                     {children}
                    </span>
                  </button>
                </div>
                <input
                  type="text"
                  {...field}
                  value={field.value ?? ""}
                  placeholder={placeholder}
                  className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-1">{error.message}</p>
              )}{" "}
            </>
          )}
        />
      </div>
    </>
  );
};

export default CustomSocialInput;
