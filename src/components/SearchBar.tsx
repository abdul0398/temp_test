"use client";

import React, { useState, useEffect } from "react";

type SearchBarProps = {
  onSearch: (term: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [term, setTerm] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(term.trim()); // Always trigger onSearch, even when empty
    }, 500);

    return () => clearTimeout(delay);
  }, [term, onSearch]);

  return (
    <input
      type="text"
      placeholder="Search a concept"
      value={term}
      onChange={(e) => setTerm(e.target.value)}
      className="w-full px-4 py-2 focus:outline-none bg-[#252424] border-0 rounded-[31px] h-[52px]"
    />
  );
}
