"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Utensils } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname();
    if(pathname == "/"){
        return (
            <></>
        )
    }
  return (
    <header className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold mb-4 sm:mb-0">
          <Utensils className="h-8 w-8" />
          <span className="font-serif">Recipal</span>
        </Link>
        <nav>
          <ul className="flex flex-wrap justify-center sm:justify-end space-x-2 sm:space-x-4">
            <li>
              <Link href="/how-to-use" passHref>
                <Button variant="ghost" className="text-white hover:text-yellow-200 hover:bg-orange-600">
                  How to Use
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/about" passHref>
                <Button variant="ghost" className="text-white hover:text-yellow-200 hover:bg-orange-600">
                  About Us
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}