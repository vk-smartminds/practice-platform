import React from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { cookies } from "next/headers"; // Import the cookies function


// This is a Server Component. It fetches initial data.
const getClasses = async () => {
  // 1. Get the authentication token from the cookies
  const cookieStore = cookies();
  // @ts-ignore
  const tokenCookie = cookieStore.get("token"); // <-- IMPORTANT: Use the actual name of your auth cookie (e.g., 'jwt', 'accessToken')


  // 2. Prepare the headers
  const headers = {
    "Content-Type": "application/json",
  };
  if (tokenCookie) {
    // @ts-ignore
    headers["Cookie"] = `token=${tokenCookie.value}`; // <-- Forward the cookie
  }


  try {
    // 3. Make the authenticated request
    const res = await fetch("http://localhost:8000/api/admin/classes", {
      headers,
      cache: "no-store",
    });


    if (!res.ok) {
      // Provide more specific error feedback
      if (res.status === 401) {
        throw new Error("Unauthorized: Please log in as an admin.");
      }
      throw new Error(`Failed to fetch classes. Status: ${res.status}`);
    }
    return res.json();
  } catch (error: any) {
    console.error("Error fetching classes:", error.message);
    // Re-throw the error so we can display a specific message in the UI
    throw error;
  }
};


export default async function AdminDashboardPage() {
  let classes = [];
  let error = null;


  try {
    classes = await getClasses();
  } catch (e: any) {
    error = e.message;
  }


  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      {error ? (
        <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
          <p className="font-bold">Could not load admin data.</p>
          <p>{error}</p>
        </div>
      ) : (
        <AdminLayout classes={classes} />
      )}
    </div>
  );
}



