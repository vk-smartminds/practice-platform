// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { CustomInput } from "../ui/CustomInput";
import { CustomSelect } from "../ui/CustomSelect";
import { Notification } from "../ui/Notification";
import { LoaderIcon, PlusIcon } from "../ui/Icons";


const API_BASE_URL = "http://localhost:8000/api/admin";


interface Class {
  _id: string;
  name: string;
}


export const CreateChapterForm = ({ classes }: { classes: Class[] }) => {
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");


  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "" as "success" | "error",
  });


  useEffect(() => {
    if (!classId) {
      setSubjects([]);
      setSubjectId("");
      return;
    }
    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/subjects/class/${classId}`, {
          credentials: "include", // <-- IMPORTANT: Include cookies in the request
        });
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();
        setSubjects(data);
      } catch (error: any) {
        setNotification({ message: error.message, type: "error" });
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, [classId]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setNotification({ message: "", type: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/chapters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Ensure you are sending 'chapterName' from the frontend
            body: JSON.stringify({ 
                chapterName: title, // Send the 'title' state as 'chapterName'
                chapterNumber, 
                subjectId 
            }),
            credentials: 'include',
        });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create chapter.");


      setNotification({
        message: `Chapter "${data.title}" created successfully!`,
        type: "success",
      });
      setTitle("");
      setChapterNumber("");
    } catch (error: any) {
      setNotification({ message: error.message, type: "error" });
    } finally {
      setFormLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Create New Chapter
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
      <CustomSelect
        label="Select Subject"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        options={subjects}
        placeholder="-- Choose a subject --"
        disabled={!classId}
        loading={subjectsLoading}
      />
      <CustomInput
        label="Chapter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Polynomials"
      />
      <CustomInput
        label="Chapter Number"
        type="number"
        value={chapterNumber}
        onChange={(e) => setChapterNumber(e.target.value)}
        placeholder="e.g., 2"
      />
      <button
        type="submit"
        disabled={formLoading || !subjectId || !title || !chapterNumber}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {formLoading ? (
          <LoaderIcon className="animate-spin" />
        ) : (
          <>
            <PlusIcon className="mr-2 h-5 w-5" /> Create Chapter
          </>
        )}
      </button>
    </form>
  );
};



