import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  backButton?: ReactNode;
}

const AuthLayout = ({ children, backButton }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4 relative">
      {backButton && (
        <div className="absolute top-6 left-6">
          {backButton}
        </div>
      )}

      <div className="w-full max-w-sm bg-gradient-to-b from-orange-200/90 to-orange-100/90 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;