'use client'

import Header from "@/ui/Header";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500">
      <Header 
        variant="gradient"
        showBackButton={true}
        backUrl="/"
        title="Order"
      />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}