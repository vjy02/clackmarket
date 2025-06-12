"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.svg";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { User } from "@supabase/supabase-js";
import { CircleUser, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [flyoutClicked, setFlyoutClicked] = useState<boolean>(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsAuthChecked(true);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-20">
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
          
          <nav className="hidden md:flex space-x-6 items-center text-sm text-gray-700">
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

             { user ? (
                <>
                  <Link
                    href="/list"
                    className="text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    List
                  </Link>
                  <DropdownMenu
                    modal={false}
                    onOpenChange={() => setFlyoutClicked(!flyoutClicked)}
                  >
                    <DropdownMenuTrigger className="focus:outline-none">
                      <CircleUser
                        className={`h-6 w-6 text-gray-700 hover:text-cyan-600 cursor-pointer ${
                          flyoutClicked && "text-cyan-600"
                        }`}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuItem
                        asChild
                        className="hover:cursor-pointer"
                      >
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="hover:cursor-pointer"
                      >
                        <Link href="/listings">My Listings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        asChild
                        className="hover:cursor-pointer"
                      >
                        <div>
                          <LogOut />
                          <LogoutButton />
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <LoginButton />
              )
            }
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
