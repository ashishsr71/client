"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <form onSubmit={handleSearch} className='flex items-center gap-2 rounded-md ring-1 ring-gray-200 px-2 py-1.5 shadow-sm bg-white text-black w-full'>
      <button type="submit" aria-label="Search">
        <Search className="w-4 h-4 text-gray-500 cursor-pointer hover:text-cyan-500 transition-colors"/>
      </button>
      <input 
        id="search" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..." 
        className="text-sm outline-none bg-transparent w-full"
      />
    </form>
  )
}

export default SearchBar;