import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

export function SearchBar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [term, setTerm] = useState(searchParams.get('q') || '');


    useEffect(() => {
        const handler = setTimeout(() => {
            const current = searchParams.get('q') || '';
            if (term !== current) {
                const newParams = new URLSearchParams(searchParams);
                if (term) {
                    newParams.set('q', term);
                } else {
                    newParams.delete('q');
                }

                newParams.set('page', '1');
                setSearchParams(newParams);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [term, searchParams, setSearchParams]);

    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[--color-brand-gray-text]" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-brand-border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by Name or Phone..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
        </div>
    );
}
