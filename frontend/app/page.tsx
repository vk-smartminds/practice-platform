// @ts-nocheck
"use client";
// SVG Icon Components
const GameIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12h12M12 6v12" />
        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    </svg>
);

const ConceptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
);

const MotivationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 11l4 4L22 9" />
    </svg>
);

// New Animated Hero Illustration
const AnimatedHeroIllustration = () => {
    return (
        <div className="relative w-[400px] h-[400px]">
            {/* Main Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg width="350" height="350" viewBox="0 0 200 200">
                    <path fill="#e0f2fe" d="M49.8,-64.5C62.6,-54.3,70,-38.3,74.9,-21.8C79.8,-5.3,82.2,11.8,75.9,26.2C69.6,40.6,54.6,52.3,39.3,61.8C24,71.3,8.4,78.6,-6.9,80.5C-22.2,82.4,-44.4,78.9,-59.4,68.2C-74.4,57.5,-82.2,39.6,-84.3,21.5C-86.4,3.4,-82.8,-14.9,-73.4,-29.9C-64,-44.9,-48.8,-56.6,-33.6,-64.9C-18.4,-73.2,-3.2,-78.1,11.8,-76.3C26.8,-74.5,41.9,-74.7,49.8,-64.5Z" transform="translate(100 100)" />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black text-slate-700">A+</span>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 animate-[float_6s_ease-in-out_infinite]">
                <svg width="80" height="80" viewBox="0 0 100 100">
                    <path d="M 50,0 L 100,86.6 L 0,86.6 Z" fill="#fca5a5"/>
                </svg>
            </div>
            <div className="absolute top-24 right-4 animate-[float_7s_ease-in-out_infinite_0.5s]">
                 <svg width="40" height="40" viewBox="0 0 100 100">
                    <circle cx="50" cy="30" r="30" fill="#fde047" className="animate-pulse"/>
                    <rect x="35" y="60" width="30" height="20" fill="#facc15" />
                </svg>
            </div>
             <div className="absolute bottom-12 left-8 animate-[float_8s_ease-in-out_infinite]">
                 <svg width="90" height="90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50" fill="#f97316"/>
                    <g transform="translate(25, 35)">
                        <path d="M 0 0 L 50 0 L 50 40 L 0 40 Z" fill="#fff"/>
                        <path d="M 5 5 L 45 5" stroke="#a7f3d0" strokeWidth="4"/>
                        <path d="M 5 15 L 45 15" stroke="#a7f3d0" strokeWidth="4"/>
                        <path d="M 5 25 L 30 25" stroke="#a7f3d0" strokeWidth="4"/>
                    </g>
                </svg>
            </div>
             <div className="absolute top-16 left-5 animate-[float_5s_ease-in-out_infinite_1s]">
                <svg width="70" height="70" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="100" height="100" rx="20" fill="#67e8f9"/>
                </svg>
            </div>
        </div>
    );
};


// Generic Subject Landing Page Component
const SubjectPracticePage = ({ subject, logoUrl, features, classes }) => {
    return (
        <div className="font-sans bg-[#f7f7f7] text-slate-700">
            {/* Add Keyframes for animation */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section className="py-16 md:py-24 overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                                    The fun and effective way to master {subject}.
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto md:mx-0 mb-8">
                                    Our game-like lessons and challenges make practicing feel less like homework and more like play.
                                </p>
                                <a href="#classes" className="bg-[#58cc02] text-white border-b-4 border-[#48a302] font-bold uppercase px-10 py-4 rounded-2xl inline-block text-lg transition-all hover:bg-[#62d602] hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2">
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
                {/* <section className="py-16 sm:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            {features.map((feature, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    {feature.icon}
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                                    <p className="text-slate-500">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section> */}

                {/* Practice by Class Section */}
                <section id="classes" className="py-16 sm:py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Start Your Learning Path</h2>
                            <p className="text-slate-600 mt-2 text-lg">Select your class to begin the adventure!</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {classes.map((cls, index) => (
                                <a key={index} href="#" className="bg-white p-5 rounded-2xl border-2 border-slate-200 flex items-center space-x-6 hover:bg-slate-50 hover:border-slate-300 transition-all">
                                    <div className={`border-4 rounded-xl p-4 ${cls.bgColor} ${cls.borderColor}`}>
                                        <span className={`text-3xl font-black ${cls.textColor}`}>{cls.roman}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{cls.title}</h3>
                                        <p className="text-slate-500">{cls.description}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t-2 border-slate-200">
                <div className="container mx-auto px-6 py-12">
                     {/* <div className="flex justify-center mb-6">
                        <img src={logoUrl} alt="VK Logo" className="h-12 w-auto" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x48/slate/white?text=Logo'; }} />
                    </div> */}
                    <div className="text-[#58cc02] font-bold uppercase text-2xl flex justify-center mb-6">shivarth</div>
                    <p className="text-center text-slate-500">&copy; 2024 VK Practice Hub. All Rights Reserved.</p>
                     <div className="flex justify-center space-x-6 mt-4 text-slate-500">
                        <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};


// Main App Component to demonstrate usage
export default function App() {
    // Sample data for the component
    const subjectData = {
        subject: "Learning",
        logoUrl: "https://googleusercontent.com/file_content/1",
        features: [
            {
                icon: <GameIcon />,
                title: "Game-like Practice",
                description: "Make progress by completing bite-sized lessons and earn points for correct answers."
            },
            {
                icon: <ConceptIcon />,
                title: "Concept Reinforcement",
                description: "Solidify your understanding with questions that adapt to your level and help you improve."
            },
            {
                icon: <MotivationIcon />,
                title: "Stay Motivated",
                description: "Build a daily practice habit with friendly reminders and by tracking your progress."
            }
        ],
        classes: [
            {
                title: "Class 9",
                roman: "IX",
                description: "Foundations of Science",
                textColor: "text-amber-600",
                bgColor: "bg-amber-100",
                borderColor: "border-amber-300"
            },
            {
                title: "Class 10",
                roman: "X",
                description: "Preparing for Boards",
                textColor: "text-cyan-600",
                bgColor: "bg-cyan-100",
                borderColor: "border-cyan-300"
            },
            {
                title: "Class 11",
                roman: "XI",
                description: "Advanced Concepts",
                textColor: "text-red-600",
                bgColor: "bg-red-100",
                borderColor: "border-red-300"
            },
            {
                title: "Class 12",
                roman: "XII",
                description: "Mastering the Syllabus",
                textColor: "text-purple-600",
                bgColor: "bg-purple-100",
                borderColor: "border-purple-300"
            }
        ]
    };

    return (
        <SubjectPracticePage
            subject={subjectData.subject}
            logoUrl={subjectData.logoUrl}
            features={subjectData.features}
            classes={subjectData.classes}
        />
    );
}
