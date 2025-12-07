import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useSales } from './hooks/useSales';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { SalesTable } from './components/SalesTable';
import { Pagination } from './components/Pagination';

function App() {
  const { sales, meta, loading, error, filterOptions } = useSales();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', field);
    newParams.set('order', order);
    setSearchParams(newParams);
  };

  const currentSort = `${searchParams.get('sortBy') || 'date'}-${searchParams.get('order') || 'desc'}`;

  return (
    <div className="min-h-screen flex flex-col bg-brand-gray-bg font-sans text-brand-black-text">

      <header className="bg-white border-b border-brand-border h-16 flex items-center px-6 sticky top-0 z-10">
        <h1 className="text-xl font-bold">Sales Management System</h1>
      </header>

      <main className="flex flex-1 overflow-hidden">

        <aside className="hidden md:block w-64 flex-shrink-0 z-0">
          <FilterPanel options={filterOptions} />
        </aside>


        <section className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="p-6 space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded shadow-sm border border-brand-border">
              <SearchBar />

              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-gray-text whitespace-nowrap">Sort By:</span>
                <div className="relative">
                  <select
                    className="appearance-none border border-brand-border rounded pl-3 pr-8 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                    value={currentSort}
                    onChange={handleSortChange}
                  >
                    <option value="date-desc">Date (Newest First)</option>
                    <option value="date-asc">Date (Oldest First)</option>
                    <option value="quantity-desc">Quantity (High to Low)</option>
                    <option value="quantity-asc">Quantity (Low to High)</option>
                    <option value="customer_name-asc">Customer Name (A-Z)</option>
                    <option value="customer_name-desc">Customer Name (Z-A)</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>


            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading sales data...</div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-600 rounded">Error: {error}</div>
            ) : (
              <>
                <SalesTable data={sales} />
                {meta && <Pagination meta={meta} />}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
