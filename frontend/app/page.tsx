// app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="text-center py-16 md:py-24">
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900">
        Welcome to <span className="text-indigo-600">BrightHeads</span>
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
        Your gateway to mastering 10th-grade subjects with interactive quizzes and comprehensive guides.
      </p>
      <div className="mt-8">
        <Link href="/login"
          className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
          Get Started
        </Link>
      </div>
    </div>
  );
}