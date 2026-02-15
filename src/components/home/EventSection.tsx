"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useGuestName } from "@/hooks/useGuestName";
import FormInput from "@/ui/FormInput";

export default function EventSection() {
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
          <div className="w-full py-4">
            <p className="text-slate-600 text-center">
              Just placing an order? No signup needed!
              {activeEvent && " Enter your name below and join the event."}
              {!activeEvent && " Check back when there's an active event."}
            </p>
          </div>
          <FormInput
            type="text"
            name="guestName"
            id="guestName"
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
