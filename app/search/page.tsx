import { Listings } from '@/components/Listings';

export default function Search() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Listings disableFilters={false} />
    </div>
  );
}
