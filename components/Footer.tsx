"use client"

import Image from "next/image"
import Link from "next/link"
import logo from "@/public/logo.svg"
import { Heart } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src={logo || "/placeholder.svg"} height={40} width={24} alt="logo for clackmarket" />
              <h2 className="text-xl font-bold font-mono">ClackMarket</h2>
            </Link>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
The premier marketplace and r/mechmarket alternative for mechanical keyboard enthusiasts. Buy, sell, and discover unique keyboards, keycaps, and accessories.
Built for the community, with powerful filters and smooth user experience.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="mailto:clackmarket@gmail.com" className="text-gray-700 hover:text-cyan-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-700 hover:text-cyan-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-700 hover:text-cyan-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} ClackMarket. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-600 text-sm mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current mx-1" />
            <span>for the keyboard community</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
