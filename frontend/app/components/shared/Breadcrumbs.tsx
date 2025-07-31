// app/components/shared/Breadcrumbs.tsx
import Link from 'next/link';
import React from 'react';

type BreadcrumbLink = {
  label: string;
  href?: string;
};

type Props = {
  links: BreadcrumbLink[];
};

export default function Breadcrumbs({ links }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
      <ol className="flex items-center space-x-2">
        {links.map((link, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg 
                className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
            )}
            {link.href ? (
              <Link 
                href={link.href} 
                className="text-indigo-600 hover:underline"
              >
                {link.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-700">{link.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}