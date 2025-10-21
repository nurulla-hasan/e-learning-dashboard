/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

type TProps = {
  label: string;
  name: string;
  control: any;
  placeholder?: string;
  rows?: number;
};

const CustomTextArea = ({ label, name, control, placeholder, rows = 2 }: TProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <>
              <Textarea
                id={name}
                {...field}
                rows={rows}
                value={field.value ?? ""}
                placeholder={placeholder}
                className={`resize-y ${error ? "border-red-500 focus:border-red-500" : "border-border focus:border-border"}`}
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

export default CustomTextArea;
