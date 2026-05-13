"use client";

interface DashboardGreetingProps {
  firstName: string;
  isHost: boolean;
  hasEvent: boolean;
}

function getSubtitle(isHost: boolean, hasEvent: boolean): string {
  if (isHost) return "You're hosting this week.";
  if (hasEvent) return "Wednesday's table is open.";
  return "No event on the table yet.";
}

export default function DashboardGreeting({
  firstName,
  isHost,
  hasEvent,
}: DashboardGreetingProps) {
  return (
    <>
      <div className="ifn-display" style={{ fontSize: 36, marginBottom: 4 }}>
        Hello, {firstName}.
      </div>
      <div
        style={{
          color: "var(--ifn-muted)",
          fontSize: 14,
          marginBottom: 22,
        }}
      >
        {getSubtitle(isHost, hasEvent)}
      </div>
    </>
  );
}
