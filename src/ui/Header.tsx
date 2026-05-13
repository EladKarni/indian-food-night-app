"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

interface HeaderProps {
  className?: string;
}

// Each screen now owns its own topbar (which includes the theme toggle).
// The landing page renders only a small sign-out affordance for logged-in
// users; everything else, including the theme toggle, lives inside the page.
const Header = ({ className = "" }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  if (!user || pathname !== "/") {
    return null;
  }

  return (
    <header
      className={`flex items-center justify-end ${className}`}
      style={{
        background: "transparent",
        padding: "12px 16px 0",
        maxWidth: 420,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <button
        type="button"
        onClick={() => signOut()}
        className="ifn-pill"
        style={{
          border: 0,
          cursor: "pointer",
          fontSize: 11,
        }}
      >
        Sign out
      </button>
    </header>
  );
};

export default Header;
