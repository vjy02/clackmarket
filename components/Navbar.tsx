import { AuthButton } from "@/components/depreceate/auth-button";
import { hasEnvVars } from "@/lib/utils";
import logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src={logo}
                height={50}
                width={30}
                alt="logo for clackmarket"
              />
              <h1 className="text-2xl font-bold font-mono">ClackMarket</h1>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-6 items-center text-sm">
            <Link
              href="/"
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/search"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Search
            </Link>
            <Link
              href="/list"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              List
            </Link>
            {hasEnvVars ? <AuthButton /> : null}
          </nav>
        </div>
      </div>
    </header>
  );
};
