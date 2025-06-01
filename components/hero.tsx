import { Button } from "@/components/ui/button";
import { PackageCheck, Search, ShieldCheck, Upload, Users } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 text-5xl md:text-6xl font-extrabold leading-tight">
              Your One Stop Keeb Marketplace
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A flexible marketplace where anyone can list or buy keyboards,
            switches, keycaps and more!
          </p>

          <div className="flex gap-4 justify-center items-center">
            <Button
              size="lg"
              className="w-48 bg-purple-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              List your item
            </Button>

            <Button
              size="lg"
              className="w-48 bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Find an item
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-left">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-8 h-8 text-red-600 mb-2" />
              <div className="font-semibold text-gray-900">
                No Strict Listing Rules
              </div>
              <p className="text-gray-600 text-sm mt-1">
                List what you want with little fuss and rules
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-blue-600  mb-2" />
              <div className="font-semibold text-gray-900">Sign In With Ease</div>
              <p className="text-gray-600 text-sm mt-1">
                Make listings through using just your Google account to sign in
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <PackageCheck className="w-8 h-8 text-green-600  mb-2" />
              <div className="font-semibold text-gray-900">
                Transparent Shipping
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Clear shipping options and prices on every listing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
