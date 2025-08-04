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


export const CreateTopicForm = ({ classes }: { classes: Class[] }) => {
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [title, setTitle] = useState("");
  const [topicNumber, setTopicNumber] = useState("");


  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [chaptersLoading, setChaptersLoading] = useState(false);
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
      const res = await fetch(`${API_BASE_URL}/subjects/class/${classId}`, {
        credentials: "include",
      });
      setSubjects(await res.json());
      setSubjectsLoading(false);
    };
    fetchSubjects();
  }, [classId]);


  useEffect(() => {
    if (!subjectId) {
      setChapters([]);
      setChapterId("");
      return;
    }
    const fetchChapters = async () => {
      setChaptersLoading(true);
      const res = await fetch(`${API_BASE_URL}/chapters/subject/${subjectId}`, {
        credentials: "include",
      });


      const data = await res.json();
      console.log(data);


      setChapters(data);


      setChaptersLoading(false);
    };
    fetchChapters();
  }, [subjectId]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setNotification({ message: "", type: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, topicNumber, chapterId }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create topic.");


      setNotification({
        message: `Topic "${data.title}" created successfully!`,
        type: "success",
      });
      setTitle("");
      setTopicNumber("");
    } catch (error: any) {
      setNotification({ message: error.message, type: "error" });
    } finally {
      setFormLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Create New Topic
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
      <CustomSelect
        label="Select Chapter"
        value={chapterId}
        onChange={(e) => setChapterId(e.target.value)}
        options={chapters}
        placeholder="-- Choose a chapter --"
        disabled={!subjectId}
        loading={chaptersLoading}
      />
      <CustomInput
        label="Topic Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Euclid's Division Lemma"
      />
      <CustomInput
        label="Topic Number"
        type="text"
        value={topicNumber}
        onChange={(e) => setTopicNumber(e.target.value)}
        placeholder="e.g., 1.1"
      />
      <button
        type="submit"
        disabled={formLoading || !chapterId || !title || !topicNumber}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {formLoading ? (
          <LoaderIcon className="animate-spin" />
        ) : (
          <>
            <PlusIcon className="mr-2 h-5 w-5" /> Create Topic
          </>
        )}
      </button>
    </form>
  );
};



