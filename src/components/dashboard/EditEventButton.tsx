import Link from "next/link";

interface EditEventButtonProps {
  eventId: string;
}

export default function EditEventButton({ eventId }: EditEventButtonProps) {
  return (
    <Link
      href={`/edit-event/${eventId}`}
      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
    >
      ✏️ Edit Event
    </Link>
  );
}
