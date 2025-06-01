import { Listings } from '@/components/Listings';
import { Hero } from '@/components/Hero'

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Hero />
      <Listings disableFilters={true} />
    </div>
  );
}
