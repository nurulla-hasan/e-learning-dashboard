/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from "react-hook-form";

type TProps = {
  name: string;
  label: string;
  control: any;
};

const CustomCheckbox = ({ name, label, control }: TProps) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: {value, ...rest}, fieldState: { error } }) => (
          <>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={value || false}
                  {...rest}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="right" className="font-medium text-gray-700">
                  {label}
                </label>
              </div>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-1">{error.message}</p>
            )}{" "}
          </>
        )}
      />
    </>
  );
};

export default CustomCheckbox;
