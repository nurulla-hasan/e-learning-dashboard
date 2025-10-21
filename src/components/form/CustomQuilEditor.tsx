/* eslint-disable @typescript-eslint/no-explicit-any */
import JoditEditor from "jodit-react";
import { Controller } from "react-hook-form";

type TProps = {
  label: string;
  name: string;
  height?: number;
  control: any;
  placeholder?: string;
};

const CustomQuilEditor = ({ label, name, control, height = 200, placeholder= "Write here..", }: TProps) => {
  const config = {
    readonly: false,
    height: height,
    placeholder: placeholder,
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      "paragraph",
      "|",
      "table",
      "link",
      "|",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "fullsize",
    ],
    toolbarAdaptive: false,
  };

  return (
    <>
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>

        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <JoditEditor
                value={value || ""}
                config={config}
                onBlur={() => {}}
                onChange={(newContent) => onChange(newContent)}
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

export default CustomQuilEditor;