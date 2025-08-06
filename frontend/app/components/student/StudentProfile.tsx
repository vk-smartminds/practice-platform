"use client"
import { useAuth } from "@/app/context/AuthContext";
import { Subject } from "@/lib/types";
import { useEffect, useState } from "react";
import SubjectCard from "./SubjectCard";

export default function StudentProfile() {
    const { currentUser } = useAuth();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        const fetchSubjects = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/student/subjects/${currentUser.id}`);
            if (!response.ok) {
            throw new Error('Failed to fetch subjects');
            }
            const data: Subject[] = await response.json();
            setSubjects(data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
        };
    
        fetchSubjects();
    }, [currentUser]);
    
    if (loading) {
        return <div className="text-center">Loading...</div>;
    }
    
    return (
        <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
            Welcome, {currentUser ? currentUser.name : "Student"}!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
            <SubjectCard key={subject.id} subjectId={subject.id} subjectName={subject.name} />
            ))}
        </div>
        </div>
    );
}
