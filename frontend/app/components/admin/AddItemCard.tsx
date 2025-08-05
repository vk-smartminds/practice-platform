// @ts-nocheck
const PlusIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;

export const AddItemCard = ({ onClick, itemType }) => (
    <button
        onClick={onClick}
        className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors duration-300"
    >
        <div className="text-center">
            <PlusIcon className="mx-auto h-8 w-8" />
            <span className="mt-2 block text-sm font-medium">Add New {itemType}</span>
        </div>
    </button>
);