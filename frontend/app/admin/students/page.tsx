'use client';
import { useState, useEffect, FormEvent, useMemo } from 'react';
import { User, Class } from '@/lib/types'; // Assuming you have a Class type

// --- ICONS ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;

// --- EDIT MODAL COMPONENT ---
const EditStudentModal = ({ student, onClose, onSave }: { student: User; onClose: () => void; onSave: (updatedData: Partial<User>) => void; }) => {
    // @ts-ignore
    const [formData, setFormData] = useState({...student, classId: student.classId?._id });
    const [classes, setClasses] = useState<Class[]>([]);

    useEffect(() => {
        // Fetch available classes for the dropdown
        const fetchClasses = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/admin/classes', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setClasses(data);
                }
            } catch (error) {
                console.error("Failed to fetch classes", error);
            }
        };
        fetchClasses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                    {/* Editable Fields */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#2D3748]">Full Name</label>
                        <input id="name" type="text" value={formData.name} onChange={handleChange} className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="classId" className="block text-sm font-medium text-[#2D3748]">Class</label>
                        <select id="classId" value={formData.classId} onChange={handleChange} className="mt-1 block w-full input-style">
                            {classes.map(cls => (
                                <option key={cls._id} value={cls._id}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Read-only Fields */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#2D3748]">Email (Read-only)</label>
                        <input id="email" type="email" value={formData.email} readOnly className="mt-1 block w-full input-style bg-gray-100 cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="school" className="block text-sm font-medium text-[#2D3748]">School (Read-only)</label>
                        {/* @ts-ignore */}
                        <input id="school" type="text" value={formData.school} readOnly className="mt-1 block w-full input-style bg-gray-100 cursor-not-allowed" />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-[#2D3748] px-5 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-[#38B2AC] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#319795]">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- NEW: Stats Result Type ---
interface PincodeStats {
    count: number;
    students: {
        name: string;
        email: string;
        school: string;
    }[];
}

// --- MAIN PAGE COMPONENT ---
export default function ManageStudentsPage() {
    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

    // --- State for Search and Stats ---
    const [searchQuery, setSearchQuery] = useState('');
    const [pincode, setPincode] = useState('');
    const [timeframe, setTimeframe] = useState('week');
    const [pincodeStats, setPincodeStats] = useState<PincodeStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);

    // Fetch initial list of all students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/admin/students', { credentials: 'include' });
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

    const handlePincodeSearch = async () => {
        if (!pincode || pincode.length !== 6) {
            setError("Please enter a valid 6-digit pincode.");
            return;
        }
        setError(null);
        setStatsLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/admin/students/stats/pincode?pincode=${pincode}&timeframe=${timeframe}`, { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch pincode statistics.');
            const data = await response.json();
            setPincodeStats(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setStatsLoading(false);
        }
    };

    // Memoized filtered students for main table search
    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;
        return students.filter(student =>
            student.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [students, searchQuery]);

    const handleEdit = (student: User) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleDelete = async (studentId: string) => {
        if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;
        
        try {
            const response = await fetch(`http://localhost:8000/api/admin/student/${studentId}`, { method: 'DELETE', credentials: 'include' });
            if (!response.ok) throw new Error('Failed to delete student.');
            // @ts-ignore
            setStudents(prev => prev.filter(s => s._id !== studentId));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSave = async (updatedData: Partial<User>) => {
        if (!selectedStudent) return;
        
        try {
            // @ts-ignore
            const response = await fetch(`http://localhost:8000/api/admin/student/${selectedStudent._id}`, {
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
                <h1 className="text-3xl font-bold text-[#553C9A] mb-8">Admin Dashboard</h1>
                {error && <div className="my-4 text-center p-3 text-red-700 bg-red-100 rounded-md">{error}</div>}
                
                {/* --- UPDATED: Pincode Stats Section --- */}
                <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-2xl font-bold text-[#553C9A] mb-4">Enrollment by Pincode</h2>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        {/* Timeframe Buttons */}
                        <div>
                            {['week', 'month', '6months', 'year'].map(t => (
                                <button key={t} onClick={() => setTimeframe(t)} className={`px-3 py-1.5 text-sm rounded-md mr-2 transition-colors ${timeframe === t ? 'bg-[#553C9A] text-white' : 'bg-gray-200 text-[#2D3748] hover:bg-gray-300'}`}>
                                    {t === '6months' ? '6 Months' : t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                        {/* Pincode Input and Search Button */}
                        <div className="flex items-center gap-2">
                           <input
                                type="text"
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                className="block w-40 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm"
                           />
                           <button onClick={handlePincodeSearch} disabled={statsLoading} className="bg-[#38B2AC] text-white px-5 py-1.5 rounded-lg font-semibold hover:bg-[#319795] disabled:bg-teal-300">
                                {statsLoading ? 'Searching...' : 'Search'}
                           </button>
                        </div>
                    </div>

                    {/* Stats Results */}
                    {pincodeStats && (
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-lg text-[#2D3748]">Results for Pincode: {pincode}</h3>
                                <span className="font-bold text-xl text-[#38B2AC]">{pincodeStats.count} Student(s)</span>
                            </div>
                            <div className="max-h-60 overflow-y-auto rounded-md bg-gray-50 p-3">
                                {pincodeStats.students.length > 0 ? (
                                    <ul className="divide-y divide-gray-200">
                                        {pincodeStats.students.map((student, index) => (
                                            <li key={index} className="py-2">
                                                <p className="font-semibold text-gray-800">{student.name}</p>
                                                <p className="text-sm text-gray-600">{student.email} - {student.school}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-gray-500">No new enrollments found for this pincode in the selected period.</p>}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- NEW: Search Bar & Student Table --- */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#553C9A]">All Students</h2>
                        <input
                            type="text"
                            placeholder="Search by student email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Table Head */}
                        <thead className="bg-[#F7FAFC]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#2D3748] uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#2D3748] uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#2D3748] uppercase tracking-wider">Class</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#2D3748] uppercase tracking-wider">School</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[#2D3748] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map(student => (
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