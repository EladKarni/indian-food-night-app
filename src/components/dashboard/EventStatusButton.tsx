import Link from "next/link";
import { Tables } from "@/types/supabase-types";

type Event = Tables<"events">;

interface EventStatusButtonProps {
  event: Event | null;
}

export default function EventStatusButton({ event }: EventStatusButtonProps) {
  if (event) {
    return (
      <Link
        href="/order"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
      >
        🍛 Order Page
      </Link>
    );
  }

  return (
    <Link
      href="/create-event"
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
    >
      📅 Host Event
    </Link>
  );
}
