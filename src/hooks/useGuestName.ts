"use client";

import { useState, useEffect } from "react";

const GUEST_NAME_KEY = "ifn_guest_name";

export function useGuestName() {
  const [guestName, setGuestNameState] = useState<string>("");

  useEffect(() => {
    const savedName = localStorage.getItem(GUEST_NAME_KEY);
    if (savedName) {
      setGuestNameState(savedName);
    }
  }, []);

  const setGuestName = (name: string) => {
    setGuestNameState(name);
    if (name.trim()) {
      localStorage.setItem(GUEST_NAME_KEY, name.trim());
    } else {
      localStorage.removeItem(GUEST_NAME_KEY);
    }
  };

  const clearGuestName = () => {
    setGuestNameState("");
    localStorage.removeItem(GUEST_NAME_KEY);
  };

  return {
    guestName,
    setGuestName,
    clearGuestName,
    isValidGuestName: guestName.trim().length > 0,
  };
}