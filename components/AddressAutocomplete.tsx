"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";

interface Suggestion {
  display_name: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    state?: string;
    postcode?: string;
  };
}

interface AddressAutocompleteProps {
  value: string;
  onSelect: (addr: { street: string; city: string; state: string; zip: string }) => void;
}

export function AddressAutocomplete({ value, onSelect }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`;
        const res = await fetch(url, { signal: controller.signal, headers: { "Accept": "application/json" } });
        if (!res.ok) throw new Error("autocomplete failed");
        const json = (await res.json()) as Suggestion[];
        setSuggestions(json);
        setOpen(true);
      } catch (_) {
        // ignore
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing your street address"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="address-suggestions"
      />
      {open && suggestions.length > 0 && (
        <ul
          id="address-suggestions"
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow"
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              role="option"
              tabIndex={0}
              className="cursor-pointer px-3 py-2 hover:bg-gray-50 focus:bg-gray-50"
              onClick={() => {
                const city = s.address?.city || s.address?.town || "";
                const state = s.address?.state || "";
                const zip = s.address?.postcode || "";
                const street = [s.address?.house_number, s.address?.road].filter(Boolean).join(" ") || s.display_name;
                onSelect({ street, city, state, zip });
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const city = s.address?.city || s.address?.town || "";
                  const state = s.address?.state || "";
                  const zip = s.address?.postcode || "";
                  const street = [s.address?.house_number, s.address?.road].filter(Boolean).join(" ") || s.display_name;
                  onSelect({ street, city, state, zip });
                  setOpen(false);
                }
              }}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


