"use client"
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { User } from "@/lib/types";

// --- ICONS ---
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);
const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

// --- REUSABLE COMPONENTS ---
const ProfileDetailItem = ({ label, value }: { label: string, value?: string | null }) => (
    <div>
        <p className="text-sm text-[#2D3748]/70">{label}</p>
        <p className="font-semibold text-[#2D3748]">{value || 'Not Provided'}</p>
    </div>
);

const inputStyle = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#553C9A]";

export default function StudentProfile() {
    const { currentUser } = useAuth();
    const [profileData, setProfileData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- EDIT MODE STATE ---
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: '',
        school: '',
        guardianName: '',
        guardianMobileNumber: '',
        address: { city: '', state: '', pincode: '' }
    });
    const [isMobileValid, setIsMobileValid] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const fetchProfile = async () => {
                try {
                    const response = await fetch('http://localhost:8000/api/auth/profile', {
                        credentials: 'include',
                    });
                    if (!response.ok) throw new Error('Failed to fetch user profile.');
                    const data: User = await response.json();
                    setProfileData(data);
                    // Initialize edit form data
                    setEditData({
                        name: data.name || '',
                        school: data.school || '',
                        guardianName: data.guardianName || '',
                        guardianMobileNumber: data.guardianMobileNumber || '',
                        address: data.address || { city: '', state: '', pincode: '' }
                    });
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    // --- HANDLERS FOR EDIT MODE ---
    const handleEditClick = () => {
        setIsEditing(true);
        // Validate the initial number when entering edit mode
        const initialMobile = profileData?.guardianMobileNumber || '';
        setIsMobileValid(initialMobile.length === 10 || initialMobile.length === 0);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setError(null);
        setIsMobileValid(true); // Reset validation
        if(profileData) {
            setEditData({
                name: profileData.name || '',
                school: profileData.school || '',
                guardianName: profileData.guardianName || '',
                guardianMobileNumber: profileData.guardianMobileNumber || '',
                address: profileData.address || { city: '', state: '', pincode: '' }
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        
        if (id === 'guardianMobileNumber') {
            // Allow only numbers and enforce 10-digit limit
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue.length <= 10) {
                setEditData(prev => ({ ...prev, [id]: numericValue }));
                // Check validity for visual feedback (valid if empty or 10 digits)
                setIsMobileValid(numericValue.length === 10 || numericValue.length === 0);
            }
        } else {
            setEditData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setEditData(prev => ({
            ...prev,
            address: { ...prev.address, [id]: value }
        }));
    };

    const handleSave = async () => {
        setError(null);

        // Final validation before submitting
        if (editData.guardianMobileNumber && editData.guardianMobileNumber.length !== 10) {
            setError('Guardian mobile number must be exactly 10 digits.');
            setIsMobileValid(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile.');
            }
            const updatedProfile = await response.json();
            setProfileData(updatedProfile);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER LOGIC ---
    if (loading && !profileData) return <div className="text-center p-12">Loading user profile...</div>;
    if (!profileData) return <div className="text-center p-12">Could not load user profile. Please try logging in again.</div>;

    const fullAddress = profileData.address 
        ? `${profileData.address.city}, ${profileData.address.state} - ${profileData.address.pincode}`
        : 'Not Provided';

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#553C9A]">My Profile</h1>
                    <p className="text-md text-[#2D3748]/70 mt-1">Welcome back, {profileData.name}!</p>
                </div>
                {!isEditing ? (
                    <button onClick={handleEditClick} className="bg-[#38B2AC] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#319795] transition-all text-sm flex items-center">
                        <EditIcon /> Edit Profile
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button onClick={handleCancelClick} className="bg-gray-200 text-[#2D3748] px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm">Cancel</button>
                        <button onClick={handleSave} disabled={loading} className="bg-[#553C9A] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#44337A] transition-all text-sm flex items-center disabled:bg-purple-300">
                            <SaveIcon /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            {isEditing && error && <div className="my-4 text-center p-3 text-red-700 bg-red-100 rounded-md">{error}</div>}

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-[#553C9A] border-b pb-3 mb-4">Personal & Academic Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isEditing ? (
                            <input id="name" type="text" value={editData.name} onChange={handleInputChange} className={inputStyle} placeholder="Full Name"/>
                        ) : (
                            <ProfileDetailItem label="Full Name" value={profileData.name} />
                        )}
                        <ProfileDetailItem label="Email Address" value={profileData.email} />
                        <ProfileDetailItem label="Class" value={profileData.className} /> 
                        {isEditing ? (
                            <input id="school" type="text" value={editData.school} onChange={handleInputChange} className={inputStyle} placeholder="School Name"/>
                        ) : (
                            <ProfileDetailItem label="School" value={profileData.school} />
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-[#553C9A] border-b pb-3 mb-4">Guardian & Contact Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isEditing ? (
                            <input id="guardianName" type="text" value={editData.guardianName} onChange={handleInputChange} className={inputStyle} placeholder="Guardian's Name"/>
                        ) : (
                            <ProfileDetailItem label="Guardian's Name" value={profileData.guardianName} />
                        )}
                        {isEditing ? (
                            <input 
                                id="guardianMobileNumber" 
                                type="tel" 
                                value={editData.guardianMobileNumber} 
                                onChange={handleInputChange} 
                                className={`${inputStyle} ${!isMobileValid ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
                                placeholder="Guardian's Mobile"
                            />
                        ) : (
                            <ProfileDetailItem label="Guardian's Mobile" value={profileData.guardianMobileNumber} />
                        )}
                        <div className="md:col-span-2">
                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                    <input id="city" type="text" value={editData.address.city} onChange={handleAddressChange} className={inputStyle} placeholder="City"/>
                                    <input id="state" type="text" value={editData.address.state} onChange={handleAddressChange} className={inputStyle} placeholder="State"/>
                                    <input id="pincode" type="text" value={editData.address.pincode} onChange={handleAddressChange} className={inputStyle} placeholder="Pincode"/>
                                </div>
                            ) : (
                                <ProfileDetailItem label="Address" value={fullAddress} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}