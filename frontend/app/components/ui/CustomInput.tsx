import React from "react";


interface CustomInputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  as?: "textarea";
  name?: string;
}


export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  as,
  name,
}) => {
  const commonProps = {
    value,
    onChange,
    placeholder,
    required,
    name,
    className:
      "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
  };


  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea {...commonProps} rows={3}></textarea>
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
};