/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Controller } from "react-hook-form";

type TProps = {
  label: string;
  name: string;
  control: any;
  placeholder?: string;
  disabled?:boolean;
};

const CustomDatePicker = ({
  label,
  name,
  control,
  placeholder= "",
  disabled=false
}: TProps) => {

  return (
    <>
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <>
                  <input
                    type="date"
                    {...field}
                    value={field.value ?? ""}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full mt-1 border focus:outline-none rounded-md px-4 py-2 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      error
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
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

export default CustomDatePicker;
