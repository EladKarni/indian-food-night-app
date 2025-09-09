"use client";

import { useAuth } from "@/contexts/AuthContext";
import Button from "./button";
import LoginButton from "@/components/LoginButton";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  return (
    <header
      className={`w-full py-4 px-6 flex items-center justify-between ${variantClasses[variant]} ${className}`}
    >
      {/* Left side - Back button or Logo */}
      <div className="flex flex-col items-center space-x-4">
        {user && (
          <>
            <span className={`text-sm ${textColorClasses[variant]} opacity-75`}>
              {user.user_metadata?.full_name || user.email}
            </span>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-slate-700 text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              Dashboard
            </button>
          </>
        )}
      </div>

      {/* Center - Optional content */}
      <div className="flex-1 text-center">
        {/* This can be extended for navigation items */}
      </div>

      {/* Right side - Auth actions */}
      {showAuth && (
        <div className="flex items-center space-x-3">
          {user ? (
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
          ) : (
            <LoginButton>Login as Host</LoginButton>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
