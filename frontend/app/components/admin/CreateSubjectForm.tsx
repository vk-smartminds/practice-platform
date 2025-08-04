// @ts-nocheck
"use client";
import React, { useState } from "react";
import { CustomInput } from "../ui/CustomInput";
import { CustomSelect } from "../ui/CustomSelect";
import { Notification } from "../ui/Notification";
import { LoaderIcon, PlusIcon } from "../ui/Icons";


const API_BASE_URL = "http://localhost:8000/api/admin";


interface Class {
  _id: string;
  name: string;
}


export const CreateSubjectForm = ({ classes }: { classes: Class[] }) => {
  const [classId, setClassId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "" as "success" | "error",
  });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ message: "", type: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, classId }),
        credentials: "include", // <-- IMPORTANT: Include cookies in the request
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create subject.");


      setNotification({
        message: `Subject "${data.name}" created successfully!`,
        type: "success",
      });
      setName("");
      setClassId("");
    } catch (error: any) {
      setNotification({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Create New Subject
      </h3>
      <Notification
        {...notification}
        onDismiss={() => setNotification({ message: "", type: "" })}
      />
      <CustomSelect
        label="Select Class"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        options={classes}
        placeholder="-- Choose a class --"
      />
      <CustomInput
        label="Subject Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Mathematics"
      />
      <button
        type="submit"
        disabled={loading || !classId || !name}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {loading ? (
          <LoaderIcon className="animate-spin" />
        ) : (
          <>
            <PlusIcon className="mr-2 h-5 w-5" /> Create Subject
          </>
        )}
      </button>
    </form>
  );
};



