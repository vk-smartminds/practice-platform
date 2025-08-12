'use client';
import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// Define a type for the class data we'll fetch
interface ClassData {
  _id: string;
  name: string;
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [address, setAddress] = useState({ city: '', state: '', pincode: '' });
  const [guardianName, setGuardianName] = useState('');
  const [guardianMobileNumber, setGuardianMobileNumber] = useState<string>('');
  
  const [availableClasses, setAvailableClasses] = useState<ClassData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(true); // State for mobile validation
  const [isPincodeValid, setIsPincodeValid] = useState(true); // State for pincode validation
  const router = useRouter();
  const { register } = useAuth();

  // Fetch classes when the component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/student/classes');
        if (!response.ok) {
          throw new Error('Could not fetch class list');
        }
        const classes: ClassData[] = await response.json();
        setAvailableClasses(classes);
      } catch (err: any) {
        setError('Failed to load class options. Please refresh the page.');
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Final validation before submitting
    if (guardianMobileNumber && guardianMobileNumber.length !== 10) {
        setError('Guardian mobile number must be exactly 10 digits.');
        setIsMobileValid(false);
        return;
    }
    if (address.pincode && address.pincode.length !== 6) {
        setError('Pincode must be exactly 6 digits.');
        setIsPincodeValid(false);
        return;
    }
    if (!selectedClassId) {
        setError('Please select a class.');
        return;
    }

    setLoading(true);

    try {
      const result = await register({
        name,
        email,
        password,
        classId: selectedClassId,
        school,
        address,
        guardianName,
        guardianMobileNumber,
      });

      if (!result.success) {
        throw new Error(result.message || 'An unexpected error occurred.');
      }

      router.push('/login');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Reusable style for input fields for consistency
  const inputStyle = "block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#553C9A] focus:border-transparent";

  // Handler for updating nested address state
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === 'pincode') {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length <= 6) {
            setAddress(prev => ({ ...prev, [id]: numericValue }));
            setIsPincodeValid(numericValue.length === 6 || numericValue.length === 0);
        }
    } else {
        setAddress(prev => ({ ...prev, [id]: value }));
    }
  };

  // Handler for mobile number with validation
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = e.target.value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 10) {
          setGuardianMobileNumber(numericValue);
          // Check validity for visual feedback (valid if empty or 10 digits)
          setIsMobileValid(numericValue.length === 10 || numericValue.length === 0);
      }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-[#553C9A]">Create an Account</h2>
            <p className="mt-2 text-sm text-[#2D3748]/70">Join us and start your learning journey</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-4 gap-x-6 md:grid-cols-2">
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputStyle} placeholder="Full Name"/>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputStyle} placeholder="Email Address"/>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputStyle} placeholder="Password"/>
            <select id="class" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} required className={inputStyle} disabled={availableClasses.length === 0}>
              <option value="" disabled>Select your class...</option>
              {availableClasses.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
            <div className="md:col-span-2">
              <input id="school" type="text" value={school} onChange={(e) => setSchool(e.target.value)} required className={inputStyle} placeholder="School Name"/>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
               <input id="city" type="text" value={address.city} onChange={handleAddressChange} required className={inputStyle} placeholder="City"/>
               <input id="state" type="text" value={address.state} onChange={handleAddressChange} required className={inputStyle} placeholder="State"/>
               <input 
                  id="pincode" 
                  type="text" 
                  value={address.pincode} 
                  onChange={handleAddressChange} 
                  required 
                  className={`${inputStyle} ${!isPincodeValid ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="Pincode"
                />
            </div>

            <input id="guardianName" type="text" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} required className={inputStyle} placeholder="Guardian's Name"/>
            <input 
                id="guardianMobileNumber" 
                type="tel" 
                value={guardianMobileNumber} 
                onChange={handleMobileChange} 
                required 
                className={`${inputStyle} ${!isMobileValid ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                placeholder="Guardian's Mobile"
            />
          </div>
          
          {error && <p className="text-sm text-red-600 text-center pt-2">{error}</p>}

          <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#38B2AC] hover:bg-[#319795] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38B2AC] disabled:bg-teal-300 disabled:cursor-not-allowed">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#38B2AC] hover:text-[#319795]">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}