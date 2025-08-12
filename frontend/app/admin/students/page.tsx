'use client';
import { useState, useEffect, FormEvent } from 'react';
import { User } from '@/lib/types'; // Assuming you have a User type

// --- ICONS ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;

// --- EDIT MODAL COMPONENT ---
const EditStudentModal = ({ student, onClose, onSave }: { student: User; onClose: () => void; onSave: (updatedData: Partial<User>) => void; }) => {
    const [formData, setFormData] = useState(student);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h2 className="text-2xl font-bold text-[#553C9A] mb-4">Edit Student</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields for editable data */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#2D3748]">Full Name</label>
                        <input id="name" type="text" value={formData.name} onChange={handleChange} className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#2D3748]">Email</label>
                        <input id="email" type="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="school" className="block text-sm font-medium text-[#2D3748]">School</label>
                        {/* @ts-ignore */}
                        <input id="school" type="text" value={formData.school} onChange={handleChange} className="mt-1 block w-full input-style" />
                    </div>
                    {/* Add other fields like guardian name, etc., if needed */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-[#2D3748] px-5 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-[#38B2AC] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#319795]">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function ManageStudentsPage() {
    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('/api/admin/students', { credentials: 'include' });
                if (!response.ok) throw new Error('Failed to fetch students.');
                const data = await response.json();
                setStudents(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleEdit = (student: User) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleDelete = async (studentId: string) => {
        if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;
        
        try {
            const response = await fetch(`http://localhost:8000/api/admin/students/${studentId}`, { method: 'DELETE', credentials: 'include' });
            if (!response.ok) throw new Error('Failed to delete student.');
            // @ts-ignore
            setStudents(prev => prev.filter(s => s._id !== studentId)); // Update UI immediately
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSave = async (updatedData: Partial<User>) => {
        if (!selectedStudent) return;
        
        try {
            // @ts-ignore
            const response = await fetch(`/api/admin/students/${selectedStudent._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error('Failed to update student.');
            const updatedStudent = await response.json();
            // @ts-ignore
            setStudents(prev => prev.map(s => s._id === updatedStudent._id ? updatedStudent : s));
            setIsModalOpen(false);
            setSelectedStudent(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center p-12">Loading students...</div>;

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold text-[#553C9A] mb-6">Manage Students</h1>
                {error && <div className="my-4 text-center p-3 text-red-700 bg-red-100 rounded-md">{error}</div>}
                
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#F7FAFC]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#2D3748] uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#2D3748] uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#2D3748] uppercase tracking-wider">Class</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#2D3748] uppercase tracking-wider">School</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[#2D3748] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(student => (
                                // @ts-ignore
                                <tr key={student._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2D3748]">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                                    {/* @ts-ignore */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.classId?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.school}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handleEdit(student)} className="text-[#553C9A] hover:text-[#38B2AC] p-1"><EditIcon /></button>
                                        {/* @ts-ignore */}
                                        <button onClick={() => handleDelete(student._id)} className="text-red-600 hover:text-red-800 p-1"><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedStudent && (
                <EditStudentModal 
                    student={selectedStudent} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSave} 
                />
            )}
            <style jsx global>{`
              .input-style {
                display: block;
                width: 100%;
                padding: 0.5rem 0.75rem;
                border: 1px solid #E2E8F0;
                border-radius: 0.375rem;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
              }
              .input-style:focus {
                outline: none;
                border-color: #553C9A;
                box-shadow: 0 0 0 2px rgba(85, 60, 154, 0.2);
              }
            `}</style>
        </>
    );
}