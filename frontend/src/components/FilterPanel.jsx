import { useSearchParams } from 'react-router-dom';

export function FilterPanel({ options }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleCheckboxChange = (group, value) => {
        const newParams = new URLSearchParams(searchParams);
        const currentValues = newParams.get(group) ? newParams.get(group).split(',') : [];

        let nextValues;
        if (currentValues.includes(value)) {
            nextValues = currentValues.filter(v => v !== value);
        } else {
            nextValues = [...currentValues, value];
        }

        if (nextValues.length > 0) {
            newParams.set(group, nextValues.join(','));
        } else {
            newParams.delete(group);
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const isChecked = (group, value) => {
        const current = searchParams.get(group);
        return current ? current.split(',').includes(value) : false;
    };

    if (!options) return <div className="p-4 bg-white rounded shadow text-sm">Loading filters...</div>;

    return (
        <div className="w-64 bg-white border-r border-brand-border h-screen overflow-y-auto p-4 flex-shrink-0 sticky top-0">
            <h2 className="text-xl font-bold mb-6 text-brand-black-text">Filters</h2>


            <div className="mb-6">
                <h3 className="text-sm font-semibold text-brand-gray-text uppercase tracking-wider mb-3">Region</h3>
                <div className="space-y-2">
                    {options.regions.map(region => (
                        <label key={region} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isChecked('region', region)}
                                onChange={() => handleCheckboxChange('region', region)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{region}</span>
                        </label>
                    ))}
                </div>
            </div>


            <div className="mb-6">
                <h3 className="text-sm font-semibold text-brand-gray-text uppercase tracking-wider mb-3">Gender</h3>
                <div className="space-y-2">
                    {['Male', 'Female'].map(g => (
                        <label key={g} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isChecked('gender', g)}
                                onChange={() => handleCheckboxChange('gender', g)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{g}</span>
                        </label>
                    ))}
                </div>
            </div>


            <div className="mb-6">
                <h3 className="text-sm font-semibold text-brand-gray-text uppercase tracking-wider mb-3">Age Range</h3>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-2 py-1 border border-brand-border rounded text-sm"
                        value={searchParams.get('age_min') || ''}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);
                            if (e.target.value) params.set('age_min', e.target.value);
                            else params.delete('age_min');
                            setSearchParams(params);
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-2 py-1 border border-brand-border rounded text-sm"
                        value={searchParams.get('age_max') || ''}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);
                            if (e.target.value) params.set('age_max', e.target.value);
                            else params.delete('age_max');
                            setSearchParams(params);
                        }}
                    />
                </div>
            </div>


            <div className="mb-6">
                <h3 className="text-sm font-semibold text-brand-gray-text uppercase tracking-wider mb-3">Date Range</h3>
                <div className="space-y-2">
                    <input
                        type="date"
                        className="w-full px-2 py-1 border border-brand-border rounded text-sm text-brand-gray-text"
                        value={searchParams.get('date_from') || ''}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);
                            if (e.target.value) params.set('date_from', e.target.value);
                            else params.delete('date_from');
                            setSearchParams(params);
                        }}
                    />
                    <input
                        type="date"
                        className="w-full px-2 py-1 border border-brand-border rounded text-sm text-brand-gray-text"
                        value={searchParams.get('date_to') || ''}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);
                            if (e.target.value) params.set('date_to', e.target.value);
                            else params.delete('date_to');
                            setSearchParams(params);
                        }}
                    />
                </div>
            </div>


            <div className="mb-6">
                <h3 className="text-sm font-semibold text-brand-gray-text uppercase tracking-wider mb-3">Product Category</h3>
                <div className="space-y-2">
                    {options.categories.map(cat => (
                        <label key={cat} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isChecked('category', cat)}
                                onChange={() => handleCheckboxChange('category', cat)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>


            <div className="mb-6">
                <h3 className="text-sm font-semibold text-brand-gray-text uppercase tracking-wider mb-3">Tags</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {(options.tags || []).map(tag => (
                        <label key={tag} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isChecked('tags', tag)}
                                onChange={() => handleCheckboxChange('tags', tag)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{tag}</span>
                        </label>
                    ))}
                </div>
            </div>


            <div className="mb-6">
                <h3 className="text-sm font-semibold text-brand-gray-text uppercase tracking-wider mb-3">Payment Method</h3>
                <div className="space-y-2">
                    {options.payment_methods.map(pm => (
                        <label key={pm} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isChecked('payment_method', pm)}
                                onChange={() => handleCheckboxChange('payment_method', pm)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{pm}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
