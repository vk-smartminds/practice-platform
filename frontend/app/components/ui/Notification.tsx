import React from "react";
import { AlertCircleIcon, CheckCircle2Icon } from "./Icons";


interface NotificationProps {
  message: string;
  type: "success" | "error" | "";
  onDismiss: () => void;
}


export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onDismiss,
}) => {
  if (!message) return null;
  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-100" : "bg-red-100";
  const borderColor = isSuccess ? "border-green-400" : "border-red-400";
  const textColor = isSuccess ? "text-green-800" : "text-red-800";
  const Icon = isSuccess ? CheckCircle2Icon : AlertCircleIcon;


  return (
    <div
      className={`${bgColor} ${borderColor} ${textColor} border-l-4 p-4 my-4 rounded-r-lg relative`}
      role="alert"
    >
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3" />
        <p className="font-bold">{isSuccess ? "Success" : "Error"}</p>
      </div>
      <p className="ml-8">{message}</p>
      <button
        onClick={onDismiss}
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
      >
        <span className="text-2xl">&times;</span>
      </button>
    </div>
  );
};



