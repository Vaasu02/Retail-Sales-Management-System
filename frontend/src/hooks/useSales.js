import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSales() {
    const [sales, setSales] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOptions, setFilterOptions] = useState(null);


    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchSales = async () => {
            setLoading(true);
            setError(null);
            try {
                const queryString = searchParams.toString();
                const response = await fetch(`https://retail-sales-management-system-1.onrender.com/api/sales?${queryString}&includeMeta=true`);

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const result = await response.json();
                setSales(result.data);
                setMeta(result.meta);
                if (result.meta?.options) {
                    setFilterOptions(result.meta.options);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [searchParams]); // Re-fetch whenever URL params change

    return { sales, meta, loading, error, filterOptions };
}
