import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, Copy } from 'lucide-react';

export function SalesTable({ data }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSort = (field) => {
        const currentSort = searchParams.get('sortBy');
        const currentOrder = searchParams.get('order') || 'asc';
        const newOrder = currentSort === field && currentOrder === 'asc' ? 'desc' : 'asc';

        const newParams = new URLSearchParams(searchParams);
        newParams.set('sortBy', field);
        newParams.set('order', newOrder);
        setSearchParams(newParams);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (!data.length) {
        return <div className="p-8 text-center text-brand-gray-text">No sales found matching your criteria.</div>;
    }


    return (
        <div className="overflow-x-auto border border-brand-border rounded-lg">
            <table className="min-w-full divide-y divide-brand-border">
                <thead className="bg-[#F3F3F3]">
                    <tr>
                        {[
                            'Transaction ID', 'Date', 'Customer ID', 'Customer Name', 'Phone',
                            'Gender', 'Age', 'Category', 'Qty', 'Amount', 'Payment',
                            'Region', 'Product ID', 'Employee Name'
                        ].map((header) => (
                            <th
                                key={header}
                                className="px-6 py-3 text-left text-xs font-medium text-brand-gray-text uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort(header.toLowerCase().replace(' ', '_'))}
                            >
                                <div className="flex items-center gap-2">
                                    {header}
                                    <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brand-border">
                    {data.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-text">{sale.transaction_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-text">{sale.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-text">{sale.customer_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-black-text">
                                {sale.customer_name}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-black-text flex items-center gap-2">
                                +91 {sale.phone}
                                <button onClick={() => copyToClipboard(sale.phone)} className="text-gray-400 hover:text-gray-600" title="Copy Phone">
                                    <Copy className="h-3 w-3" />
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-black-text">{sale.gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-black-text">{sale.age}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-black-text">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {sale.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-black-text">{sale.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-black-text">₹{sale.total_amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-black-text">{sale.payment_method}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-black-text">{sale.region}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-text">{sale.product_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-text">{sale.employee_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
