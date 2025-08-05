import { cookies } from 'next/headers';
import { ClientPage } from '../../../components/admin/ClientPage';

const API_BASE_URL = 'http://localhost:8000/api/admin';

// Reusable helper for making authenticated API calls from the server
const fetchData = async (url: string) => {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (tokenCookie) { headers["Cookie"] = `token=${tokenCookie.value}`; }
    try {
        const res = await fetch(url, { headers, cache: 'no-store' });
        if (!res.ok) throw new Error(`Request to ${url} failed with status ${res.status}`);
        return res.json();
    } catch (error) {
        console.error(error);
        return null; 
    }
};

export default async function ManageContentPage({ params }: { params: { slug?: string[] } }) {
    const slug = params.slug || [];
    let error: string | null = null;

    // Configuration for each level of the content hierarchy
    const levels = [
        { type: 'Class', listEndpoint: '/classes', singleEndpoint: '/classes' },
        { type: 'Subject', listEndpoint: '/subjects/class', singleEndpoint: '/subjects' },
        { type: 'Chapter', listEndpoint: '/chapters/subject', singleEndpoint: '/chapters' },
        { type: 'Topic', listEndpoint: '/topics/chapter', singleEndpoint: '/topics' },
        { type: 'Question', listEndpoint: '/questions/topic', singleEndpoint: '/questions' },
    ];

    try {
        const currentLevelIndex = slug.length;
        if (currentLevelIndex >= levels.length) throw new Error("Invalid content path.");

        const currentLevel = levels[currentLevelIndex];
        
        // Fetch data for each part of the slug to build the breadcrumbs
        const breadcrumbDataPromises = slug.map((id, index) => {
            const levelForBreadcrumb = levels[index];
            return fetchData(`${API_BASE_URL}${levelForBreadcrumb.singleEndpoint}/${id}`);
        });
        const breadcrumbItems = await Promise.all(breadcrumbDataPromises);
        
        if (breadcrumbItems.some(item => item === null)) {
            throw new Error("A parent item in the path could not be found.");
        }

        const breadcrumbs = breadcrumbItems.map((item, index) => ({
            name: item.name || item.chapterName || item.title,
            href: `/admin/manage/${slug.slice(0, index + 1).join('/')}`
        }));

        // Fetch the list of items to display on the current page
        const parentId = currentLevelIndex > 0 ? slug[currentLevelIndex - 1] : '';
        const listUrl = currentLevelIndex > 0
            ? `${API_BASE_URL}${currentLevel.listEndpoint}/${parentId}`
            : `${API_BASE_URL}${currentLevel.listEndpoint}`;
        
        const items = await fetchData(listUrl);
        if (items === null) throw new Error("Could not load content for this level.");

        // Determine the page title and the IDs needed for creating new items
        const title = currentLevelIndex > 0
            ? `${currentLevel.type}s in ${breadcrumbs[breadcrumbs.length - 1].name}`
            : 'All Classes';
            
        const parentIdKeys = ['classId', 'subjectId', 'chapterId', 'topicId'];
        const parentIds = slug.reduce<Record<string, string>>((acc, id, index) => {
            // The parent ID for a new item is the ID of the item at the current level
            const parentKey = parentIdKeys[index];
            if (parentKey) acc[parentKey] = id;
            return acc;
        }, {});

        return (
            <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
                <ClientPage 
                    title={title} 
                    items={items} 
                    breadcrumbs={breadcrumbs} 
                    itemType={currentLevel.type} 
                    parentIds={parentIds} 
                />
            </div>
        );

    } catch (e: any) {
        error = e.message;
    }

    // Render a user-friendly error state if any step fails
    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen p-8">
                <div className="text-center bg-red-100 text-red-700 p-6 rounded-lg">
                    <h2 className="font-bold text-lg">Error Loading Page</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // This is a fallback, should not typically be reached
    return <div>An unexpected error occurred.</div>;
}
