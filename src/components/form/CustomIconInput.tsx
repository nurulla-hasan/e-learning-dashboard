/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Input } from "../ui/input";
import { type IconType } from "react-icons";

type TProps = {
  label: string;
  name: string;
  control: any;
  type?: "text" | "password";
  placeholder?: string;
  onInput?: React.FormEventHandler<HTMLInputElement>;
  icon: LucideIcon | IconType;
  disabled?: boolean
};

const CustomIconInput = ({
  label,
  name,
  type = "text",
  control,
  placeholder= "",
  icon:Icon,
  disabled=false
}: TProps) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
        <div className="relative">
          <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
              <>
                {type === "password" ? (
                  <>
                    <Input
                      id={name}
                      type={showPassword ? "text" : "password"}
                      {...field}
                      value={field.value ?? ""}
                      placeholder={placeholder}
                      className={`pl-10 bg-input ${error ? "border-red-500 focus:border-red-500" : "border-border focus:border-border"}`}
                      disabled={disabled}                      
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 cursor-pointer top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </>
                ) : (
                  <Input
                    id={name}
                    type={type}
                    {...field}
                    value={field.value ?? ""}
                    placeholder={placeholder}
                    className={`pl-10 bg-input ${error ? "border-red-500 focus:border-red-500" : "border-border focus:border-border"}`}
                    disabled={disabled}
                  />
                )
                }
                {error && (
                  <p className="text-red-600 text-sm mt-1">{error.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default CustomIconInput;
