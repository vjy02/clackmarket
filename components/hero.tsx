"use client";

import { Button } from "@/components/ui/button";
import { PackageCheck, Search, ShieldCheck, Upload, Users } from "lucide-react";
import boxImg from "@/public/box.png";
import keebImg from "@/public/money.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left image */}
        <Image
          src={boxImg}
          height={400}
          width={400}
          alt="Left decorative"
          className="hidden lg:block lg:mb-10"
        />

        {/* Center text content */}
        <div className="w-full text-center px-4">
          <h1 className="mb-6 text-5xl md:text-6xl font-extrabold leading-tight">
            Your One Stop Keeb Marketplace
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A flexible marketplace where anyone can list or buy keyboards,
            switches, keycaps and more!
          </p>

          <div className="flex gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              onClick={() => {
                router.push("/list");
              }}
              className="w-36 text-xs md:text-md md:w-48 bg-purple-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              List your item
            </Button>

            <Button
              size="lg"
              onClick={() => {
                router.push("/search");
              }}
              className="w-36 text-xs md:text-md md:w-48 bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Find an item
            </Button>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-left">
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
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <div className="font-semibold text-gray-900">
                Sign In With Ease
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Make listings through using just your Google account to sign in
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <PackageCheck className="w-8 h-8 text-green-600 mb-2" />
              <div className="font-semibold text-gray-900">
                Transparent Shipping
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Clear shipping options and prices on every listing
              </p>
            </div>
          </div>
        </div>

        {/* Right image */}
        <Image
          src={keebImg}
          height={400}
          width={400}
          alt="Right decorative"
          className="hidden lg:block lg:mb-16"
        />
      </div>
    </section>
  );
};
