"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useGuestName } from "@/hooks/useGuestName";
import FormInput from "@/ui/FormInput";
import PageContainer from "@/ui/PageContainer";

export default function Home() {
  const { activeEvent } = useActiveEvent();
  const { user } = useAuth();
  const { guestName, setGuestName, isValidGuestName } = useGuestName();

  const eventRelatedBtn = () => {
    if (!activeEvent) {
      return (
        <div className="space-x-4 flex flex-col items-center justify-center">
          <span className="text-slate-700">No upcoming events</span>
        </div>
      );
    }

    return (
      <div className="space-x-4 flex flex-col items-center justify-center space-y-4">
        {!user && (
          <div className="w-full">
            <FormInput
              type="text"
              placeholder="Enter your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              variant="daisyui"
            />
          </div>
        )}
        <Link
          href="/order"
          className={`font-medium py-3 px-6 rounded-2xl transition-colors w-full text-center inline-block ${
            user || isValidGuestName
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-gray-400 text-gray-600 cursor-not-allowed pointer-events-none"
          }`}
        >
          Join Event
        </Link>
      </div>
    );
  };

  const mainButtonIfNoUser = () => {
    if (!user) {
      return (
        <div className="space-x-4 flex flex-col items-center justify-center">
          <Link
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-2xl transition-colors w-full text-center inline-block"
          >
            Login / Signup
          </Link>
        </div>
      );
    }
    return (
      <div className="space-x-4 flex flex-col items-center justify-center">
        <Link
          href="/dashboard"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-2xl transition-colors w-full text-center inline-block"
        >
          Dashboard
        </Link>
      </div>
    );
  };

  return (
    <PageContainer variant="gradient" className="flex-col">
      <div className="text-center space-y-16">
        <h1 className="text-8xl font-bold text-slate-800 tracking-wider">
          IFN
        </h1>
        <div className="space-y-8">{mainButtonIfNoUser()}</div>
        <div className="space-y-8">{eventRelatedBtn()}</div>
      </div>
    </PageContainer>
  );
}
