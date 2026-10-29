"use client";

import { useEffect, useState } from "react";

const KEY = "sv_size";
const EVENT = "sv:size";
export const DEFAULT_SIZE = 2225;

/** The home size a visitor picked on LP2. Shared by the payment scene, the calculator and every lead (LeadForm reads sv_size). */
export function useHomeSize(): [number, (n: number) => void] {
  const [size, setSize] = useState(DEFAULT_SIZE);
  useEffect(() => {
    const read = () => {
      try {
        const v = Number(sessionStorage.getItem(KEY));
        if (v) setSize(v);
      } catch {}
    };
    read();
    addEventListener(EVENT, read);
    return () => removeEventListener(EVENT, read);
  }, []);
  const pick = (n: number) => {
    setSize(n);
    try {
      sessionStorage.setItem(KEY, String(n));
    } catch {}
    dispatchEvent(new Event(EVENT));
  };
  return [size, pick];
}
