"use client";

import { useAuth } from "@/contexts/AuthContext";
import Button from "./button";
import LoginButton from "@/components/LoginButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showAuth?: boolean;
  className?: string;
  variant?: "default" | "transparent" | "gradient";
}

const Header = ({
  showAuth = true,
  className = "",
  variant = "default",
}: HeaderProps) => {
  const { user, signOut } = useAuth();

  const variantClasses = {
    default: "bg-white shadow-md",
    transparent: "bg-transparent",
    gradient: "bg-gradient-to-r from-orange-400 to-rose-400",
  };

  const textColorClasses = {
    default: "text-slate-800",
    transparent: "text-slate-800",
    gradient: "text-white",
  };

  if (!user) {
    return null;
  }

  return (
    <header
      className={`w-full min-h-20 py-4 px-6 flex items-center justify-between ${variantClasses[variant]} ${className}`}
    >
      {/* Left side - Back button or Logo */}
      <div className="flex flex-col items-center space-x-4">
        {user && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className={`text-sm ${textColorClasses[variant]} opacity-75`}>
              {user.user_metadata?.full_name || user.email}
            </span>
          </Link>
        )}
      </div>

      {/* Center - Optional content */}
      <div className="flex-1 text-center">
        {/* This can be extended for navigation items */}
      </div>

      {/* Right side - Auth actions */}
      {showAuth && (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant={variant === "gradient" ? "secondary" : "outline"}
              fullWidth={false}
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
