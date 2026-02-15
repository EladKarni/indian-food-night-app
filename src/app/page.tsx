"use client";

import PageContainer from "@/ui/PageContainer";
import EventSection from "@/components/home/EventSection";
import AuthSection from "@/components/home/AuthSection";

export default function Home() {
  return (
    <PageContainer variant="gradient" className="flex-col">
      <div className="text-center space-y-8">
        <h1 className="text-8xl font-bold text-slate-800 tracking-wider">
          IFN
        </h1>
        <EventSection />
        <div className="border-b border-slate-300" />
        <AuthSection />
      </div>
    </PageContainer>
  );
}
