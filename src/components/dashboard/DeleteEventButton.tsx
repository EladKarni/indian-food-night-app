"use client";

import { useState } from "react";
import { deleteEvent } from "@/lib/eventService";

interface DeleteEventButtonProps {
  eventId: string;
  userId: string;
  onDeleted: () => void;
}

export default function DeleteEventButton({
  eventId,
  userId,
  onDeleted,
}: DeleteEventButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const { error } = await deleteEvent(eventId, userId);
    setLoading(false);
    if (error) {
      setError(error);
      setConfirming(false);
    } else {
      onDeleted();
    }
  }

  if (confirming) {
    return (
      <div className="w-full flex flex-col gap-2">
        <p className="text-xs text-slate-700 text-center">
          Are you sure? This will delete the event for everyone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-600 text-center">{error}</p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
    >
      🗑️ Delete Event
    </button>
  );
}
