import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"
        }}
      ></div>

      <main className="z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-down">
          Welcome to Recipal
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">
          AI powered multi-modal recipe generator
        </p>
        <Link href="/generate">
          <Button className="bg-white text-pink-600 hover:bg-pink-100 text-lg py-3 px-8 rounded-full transition-all duration-600 transform hover:scale-105 animate-bounce">
            Generate my recipe
          </Button>
        </Link>
      </main>

      <footer className="absolute bottom-4 text-sm opacity-75">
        © 2024 Recipal. All rights reserved.
      </footer>
    </div>
  )
}