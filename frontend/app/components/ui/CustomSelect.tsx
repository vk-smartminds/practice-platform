import React from "react";
import { ChevronDownIcon, LoaderIcon } from "./Icons";


interface Option {
  _id: string;
  name?: string;
  title?: string;
  chapterName?: string; // Added to match your backend schema
}


interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
}


export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  loading = false,
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
        className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          // --- UPDATED: This logic now correctly displays chapterName ---
          <option key={option._id} value={option._id}>
            {option.name || option.title || option.chapterName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        {loading ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </div>
    </div>
  </div>
);



