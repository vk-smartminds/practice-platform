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


export const CreateQuestionForm = ({ classes }: { classes: Class[] }) => {
  // State for dropdowns
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");


  // --- UPDATED: Simplified state for Question and Answer ---
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [explanation, setExplanation] = useState("");


  // State for dependent data and loading
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "" as "success" | "error",
  });


  // Effects to fetch dependent data (no changes here)
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
      setChapters(await res.json());
      setChaptersLoading(false);
    };
    fetchChapters();
  }, [subjectId]);


  useEffect(() => {
    if (!chapterId) {
      setTopics([]);
      setTopicId("");
      return;
    }
    const fetchTopics = async () => {
      setTopicsLoading(true);
      const res = await fetch(`${API_BASE_URL}/topics/chapter/${chapterId}`, {
        credentials: "include",
      });
      setTopics(await res.json());
      setTopicsLoading(false);
    };
    fetchTopics();
  }, [chapterId]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setNotification({ message: "", type: "" });
    try {
      // --- UPDATED: New request body for simple Q&A ---
      const res = await fetch(`${API_BASE_URL}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText,
          answerText,
          explanation,
          topicId,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create question.");


      setNotification({
        message: `Question created successfully!`,
        type: "success",
      });
      // Reset form
      setQuestionText("");
      setAnswerText("");
      setExplanation("");
    } catch (error: any) {
      setNotification({ message: error.message, type: "error" });
    } finally {
      setFormLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Create New Question
      </h3>
      <Notification
        {...notification}
        onDismiss={() => setNotification({ message: "", type: "" })}
      />


      {/* Dropdowns */}
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
      <CustomSelect
        label="Select Topic"
        value={topicId}
        onChange={(e) => setTopicId(e.target.value)}
        options={topics}
        placeholder="-- Choose a topic --"
        disabled={!chapterId}
        loading={topicsLoading}
      />


      <hr />


      {/* --- UPDATED: Simplified form fields --- */}
      <CustomInput
        as="textarea"
        label="Question"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Enter the question..."
      />
      <CustomInput
        as="textarea"
        label="Answer"
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        placeholder="Enter the answer..."
      />
      <CustomInput
        as="textarea"
        label="Explanation (Optional)"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        placeholder="Explain why the answer is correct"
        required={false}
      />


      <button
        type="submit"
        disabled={formLoading || !topicId || !questionText || !answerText}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {formLoading ? (
          <LoaderIcon className="animate-spin" />
        ) : (
          <>
            <PlusIcon className="mr-2 h-5 w-5" /> Create Question
          </>
        )}
      </button>
    </form>
  );
};



