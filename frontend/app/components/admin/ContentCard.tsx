// @ts-nocheck
import Link from 'next/link';

const PencilIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const TrashIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="m8 6 4-4 4 4"/></svg>;

export const ContentCard = ({ item, href, onEdit, onDelete }) => {
    const displayName = item.name || item.chapterName || item.title || item.questionText;
    const isQuestion = !!item.questionText;

    const CardContent = () => (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <Link href={href} className="block h-full">
                <div className="p-4 flex-grow">
                    <p className="font-semibold text-gray-800 break-words">{displayName}</p>
                    {isQuestion && <p className="text-sm text-gray-600 mt-2 break-words">A: {item.answerText}</p>}
                </div>
            </Link>
            <div className="flex justify-end items-center p-2 bg-gray-50 border-t rounded-b-lg space-x-2">
                <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="p-1 text-gray-500 hover:text-indigo-600 transition-colors" aria-label="Edit">
                    <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(item); }} className="p-1 text-gray-500 hover:text-red-600 transition-colors" aria-label="Delete">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    if (isQuestion) return <CardContent />;

    return (
        <CardContent />
    );
};