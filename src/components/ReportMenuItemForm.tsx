"use client";

import { useState } from "react";
import { submitHostMessage } from "@/lib/hostMessageService";

interface ReportMenuItemFormProps {
  menuItemName: string;
  menuItemId: string;
  eventId: string;
  senderName: string;
  senderId: string | null;
}

export default function ReportMenuItemForm({
  menuItemName,
  menuItemId,
  eventId,
  senderName,
  senderId,
}: ReportMenuItemFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleToggleOpen = () => {
    if (!isOpen) {
      setMessage(`"${menuItemName}" appears to be incorrect on the menu. `);
      setSubmitError(null);
      setIsSuccess(false);
    }
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitHostMessage({
        eventId,
        menuItemId,
        senderName,
        senderId,
        message: message.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setMessage("");
      }, 3000);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to send message"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-1 mb-2">
      {!isOpen && (
        <button
          type="button"
          onClick={handleToggleOpen}
          className="text-xs text-slate-300 hover:text-orange-300 underline underline-offset-2 transition-colors"
        >
          Report an issue with this item
        </button>
      )}

      {isOpen && (
        <div className="bg-slate-600 rounded-xl p-3 text-sm">
          {isSuccess ? (
            <p className="text-green-300 text-xs text-center py-1">
              Message sent to host. Thank you!
            </p>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <p className="text-slate-200 text-xs font-medium">
                  Message the host
                </p>
                <button
                  type="button"
                  onClick={handleToggleOpen}
                  className="text-slate-400 hover:text-slate-200 text-xs"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full p-2 rounded-lg bg-white text-slate-800 placeholder-slate-500 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Describe the issue or leave a message for the host..."
                disabled={isSubmitting}
              />

              {message.length > 400 && (
                <p className="text-xs text-slate-400 mt-1">
                  {500 - message.length} characters remaining
                </p>
              )}

              {submitError && (
                <p className="text-xs text-red-400 mt-1">{submitError}</p>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleToggleOpen}
                  className="flex-1 bg-slate-500 hover:bg-slate-400 text-white text-xs py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !message.trim()}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send to Host"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
