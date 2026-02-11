"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useGuestName } from "@/hooks/useGuestName";
import FormInput from "@/ui/FormInput";
import PageContainer from "@/ui/PageContainer";

function EventSection() {
  const { activeEvent } = useActiveEvent();
  const { user } = useAuth();
  const { guestName, setGuestName, isValidGuestName } = useGuestName();

  if (!activeEvent) {
    return (
      <div className="space-x-4 flex flex-col items-center justify-center">
        <span className="text-slate-700">No upcoming events</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
      {!user && (
        <div className="w-full">
          <div className="border-t border-slate-300 w-full pt-4">
            <p className="text-slate-600 text-center">
              Just placing an order? No signup needed!
              {activeEvent && " Enter your name below and join the event."}
              {!activeEvent && " Check back when there's an active event."}
            </p>
          </div>
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
        className={`font-medium py-3 px-6 rounded-2xl transition-colors w-full text-center inline-block ${user || isValidGuestName
            ? "bg-orange-500 hover:bg-orange-600 text-white"
            : "bg-gray-400 text-gray-600 cursor-not-allowed pointer-events-none"
          }`}
      >
        Join Event
      </Link>
    </div>
  );
}

function AuthSection() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
        <div className="text-center space-y-3 w-full">
          <p className="text-slate-600 text-lg">
            Want to host an event?
          </p>
          <Link
            href="/signup"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-2xl transition-colors w-full text-center inline-block"
          >
            Sign Up to Host
          </Link>
          <p className="text-slate-500 text-sm mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 hover:text-orange-600 underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
      <Link
        href="/dashboard"
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-2xl transition-colors w-full text-center inline-block"
      >
        Dashboard
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <PageContainer variant="gradient" className="flex-col">
      <div className="text-center space-y-8">
        <h1 className="text-8xl font-bold text-slate-800 tracking-wider">
          IFN
        </h1>
        <EventSection />
        <AuthSection />
      </div>
    </PageContainer>
  );
}
