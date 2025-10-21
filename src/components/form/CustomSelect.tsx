/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller } from "react-hook-form";

type TProps = {
  label: string;
  name: string;
  control: any;
  options: {
    label: string;
    value: string;
  }[];
  disabled?:boolean,
  blankOption?: boolean
};

const CustomSelect = ({ label, name, control, options, disabled=false, blankOption=true }: TProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <>
              <div className="relative">
                <select
                  {...field}
                  disabled={disabled}
                  className={`w-full px-3 py-2 border text-gray-700 bg-white disabled:bg-gray-200 rounded-md appearance-none focus:outline-none ${
                        error
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                >
                  {
                    blankOption && (
                      <option value="">Select {label}</option>
                    )
                  }
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-1">{error.message}</p>
              )}
            </>
          )}
        />
      </div>
    </>
  );
};

export default CustomSelect;
