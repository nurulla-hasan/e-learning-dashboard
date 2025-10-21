/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Controller } from "react-hook-form";

type TProps = {
    label: string;
    name: string;
    control: any;
    placeholder?: string;
    onInput?: React.FormEventHandler<HTMLInputElement>;
};

const CustomColorField = ({
    label,
    name,
    control,
    placeholder = "",
    onInput,
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
                                type="color"
                                {...field}
                                value={field.value ?? ""}
                                placeholder={placeholder}
                                onInput={onInput}
                                className={`w-full mt-1 border focus:outline-none rounded-md ${error
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

export default CustomColorField;
