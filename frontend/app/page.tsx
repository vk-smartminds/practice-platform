"use client";
import React from 'react';

// SVG Icon Components
const GameIcon = () => (
    <svg className="w-8 h-8 text-[#38B2AC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
);
const ConceptIcon = () => (
    <svg className="w-8 h-8 text-[#D53F8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const MotivationIcon = () => (
    <svg className="w-8 h-8 text-[#553C9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
);

// Animated Hero Illustration with the new color palette
const AnimatedHeroIllustration = () => {
    return (
        <div className="relative w-[400px] h-[400px]">
            {/* Main Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[float_10s_ease-in-out_infinite]">
                <svg width="350" height="350" viewBox="0 0 200 200">
                    <path fill="#E9D8FD" d="M49.8,-64.5C62.6,-54.3,70,-38.3,74.9,-21.8C79.8,-5.3,82.2,11.8,75.9,26.2C69.6,40.6,54.6,52.3,39.3,61.8C24,71.3,8.4,78.6,-6.9,80.5C-22.2,82.4,-44.4,78.9,-59.4,68.2C-74.4,57.5,-82.2,39.6,-84.3,21.5C-86.4,3.4,-82.8,-14.9,-73.4,-29.9C-64,-44.9,-48.8,-56.6,-33.6,-64.9C-18.4,-73.2,-3.2,-78.1,11.8,-76.3C26.8,-74.5,41.9,-74.7,49.8,-64.5Z" transform="translate(100 100)" />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black text-[#553C9A]">A+</span>
            </div>
            {/* Floating Elements using the new palette */}
            <div className="absolute top-10 right-10 animate-[float_6s_ease-in-out_infinite]">
                 <svg width="80" height="80" viewBox="0 0 100 100">
                    <path d="M 50,0 L 100,86.6 L 0,86.6 Z" fill="#38B2AC"/>
                </svg>
            </div>
            <div className="absolute top-24 right-4 animate-[float_7s_ease-in-out_infinite_0.5s]">
                <svg width="40" height="40" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50" fill="#D53F8C" className="animate-pulse"/>
                </svg>
            </div>
             <div className="absolute bottom-12 left-8 animate-[float_8s_ease-in-out_infinite]">
                 <svg width="90" height="90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50" fill="#553C9A"/>
                </svg>
            </div>
        </div>
    );
};

// Type definitions
interface ClassInfo {
    title: string;
    roman: string;
    description: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
}
interface Feature {
    icon: React.ReactElement;
    title: string;
    description: string;
}
interface SubjectPracticePageProps {
    subject: string;
    features: Feature[];
    classes: ClassInfo[];
}

const SubjectPracticePage: React.FC<SubjectPracticePageProps> = ({ subject, features, classes }) => {
    return (
        <div className="font-sans bg-[#F7FAFC] text-[#2D3748]">
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>

            <main>
                {/* Hero Section */}
                <section className="py-20 md:py-28 overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 text-center md:text-left">
                                <h1 className="text-5xl md:text-6xl font-extrabold text-[#553C9A] leading-tight mb-4">
                                    Master {subject}, <br/> <span className="text-[#38B2AC]">Simply and Effectively.</span>
                                </h1>
                                <p className="text-lg md:text-xl text-[#2D3748]/70 max-w-xl mx-auto md:mx-0 mb-8">
                                    Our platform provides a focused, distraction-free environment to help you practice, learn, and excel.
                                </p>
                                <a href="#classes" className="bg-[#553C9A] text-white font-bold uppercase px-10 py-4 rounded-xl inline-block text-lg transition-all hover:bg-[#44337A] hover:-translate-y-0.5 active:translate-y-0.5 shadow-lg">
                                    Get Started
                                </a>
                            </div>
                            <div className="order-1 md:order-2 flex justify-center items-center">
                                <AnimatedHeroIllustration />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[#553C9A]">Designed for Student Success</h2>
                            <p className="mt-4 text-[#2D3748]/70">The tools you need for focused and effective learning.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-[#F7FAFC] p-8 rounded-xl border border-gray-200 text-center transition-all duration-300 hover:border-[#38B2AC] hover:shadow-lg">
                                    <div className="inline-block p-4 bg-[#38B2AC]/10 rounded-full mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mt-4 text-[#553C9A]">{feature.title}</h3>
                                    <p className="mt-2 text-[#2D3748]/70">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Practice by Class Section */}
                <section id="classes" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#553C9A]">Start Your Learning Path</h2>
                            <p className="text-[#2D3748]/70 mt-2 text-lg">Select your class to begin the adventure!</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {classes.map((cls: ClassInfo, index: number) => (
                                <a key={index} href="#" className="bg-white p-5 rounded-2xl border-2 border-gray-200 flex items-center space-x-6 hover:bg-white hover:border-[#553C9A] transition-all hover:shadow-xl">
                                    <div className={`border-4 rounded-xl p-4 ${cls.bgColor} ${cls.borderColor}`}>
                                        <span className={`text-3xl font-black ${cls.textColor}`}>{cls.roman}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#553C9A]">{cls.title}</h3>
                                        <p className="text-[#2D3748]/80">{cls.description}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="container mx-auto px-6 py-8">
                    <div className="text-[#553C9A] font-bold uppercase text-2xl flex justify-center mb-6">Shivarth</div>
                    <p className="text-center text-[#2D3748]/60">&copy; 2024 Shivarth. All Rights Reserved.</p>
                     <div className="flex justify-center space-x-6 mt-4 text-[#2D3748]/60">
                        <a href="#" className="hover:text-[#2D3748] transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-[#2D3748] transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Main App Component to demonstrate usage
export default function App() {
    const subjectData = {
        subject: "Your Subjects",
        features: [
            { icon: <GameIcon />, title: "Targeted Practice", description: "Access thousands of questions organized by subject, chapter, and topic to master exactly what you need." },
            { icon: <ConceptIcon />, title: "Instant Feedback", description: "Understand your mistakes and reinforce concepts immediately with clear, concise explanations." },
            { icon: <MotivationIcon />, title: "Track Your Progress", description: "Visually track your performance over time, identify your strengths, and pinpoint areas that need more attention." }
        ],
        classes: [
            {
                title: "Class 9", roman: "IX", description: "Foundations of Science",
                textColor: "text-[#38B2AC]", bgColor: "bg-[#38B2AC]/10", borderColor: "border-[#38B2AC]/30"
            },
            {
                title: "Class 10", roman: "X", description: "Preparing for Boards",
                textColor: "text-[#D53F8C]", bgColor: "bg-[#D53F8C]/10", borderColor: "border-[#D53F8C]/30"
            },
            {
                title: "Class 11", roman: "XI", description: "Advanced Concepts",
                textColor: "text-[#553C9A]", bgColor: "bg-[#553C9A]/10", borderColor: "border-[#553C9A]/30"
            },
            {
                title: "Class 12", roman: "XII", description: "Mastering the Syllabus",
                textColor: "text-[#2D3748]", bgColor: "bg-[#2D3748]/10", borderColor: "border-[#2D3748]/30"
            }
        ]
    };

    return (
        <SubjectPracticePage
            subject={subjectData.subject}
            features={subjectData.features}
            classes={subjectData.classes}
        />
    );
}
