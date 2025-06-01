import { Listings } from '@/components/Listings';
import { Navbar } from '@/components/Navbar';

export default function Search() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Navbar />
      <Listings disableFilters={false} />
    </div>
  );
}
