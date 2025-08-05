// @ts-nocheck
import Link from 'next/link';

const ChevronRightIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;

export const Breadcrumbs = ({ items }) => (
    <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2">
            <li>
                <div>
                    <Link href="/admin/manage" className="text-gray-500 hover:text-gray-700">
                        <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg>
                        <span className="sr-only">Home</span>
                    </Link>
                </div>
            </li>
            {items.map((item, index) => (
                <li key={index}>
                    <div className="flex items-center">
                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                        <Link
                            href={item.href}
                            className="ml-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            aria-current={index === items.length - 1 ? 'page' : undefined}
                        >
                            {item.name}
                        </Link>
                    </div>
                </li>
            ))}
        </ol>
    </nav>
);