"use client";

import { useActiveEvent } from "@/hooks/useActiveEvent";
import EventSection from "@/components/home/EventSection";
import AuthSection from "@/components/home/AuthSection";
import ThemeToggle from "@/ui/ThemeToggle";

export default function Home() {
  const { activeEvent } = useActiveEvent();

  return (
    <main className="ifn-screen ifn-app">
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 24px 32px",
          maxWidth: 420,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div className="ifn-eyebrow">Wednesday Ritual · est. 2024</div>
            {activeEvent && (
              <div className="ifn-pill ifn-pill--accent">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--ifn-primary)",
                  }}
                />
                Event live
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>

        <div style={{ marginTop: 28 }}>
          <div className="ifn-display" style={{ fontSize: 76 }}>
            Indian
            <br />
            Food
            <br />
            Night.
          </div>
          <p
            style={{
              marginTop: 22,
              color: "var(--ifn-ink-2)",
              fontSize: 15.5,
              lineHeight: 1.45,
              maxWidth: 280,
            }}
          >
            Pick a dish, set your spice, and we&apos;ll handle the math &amp;
            the phone call.
          </p>
        </div>

        <div style={{ marginTop: 28 }}>
          <EventSection />
        </div>

        <div style={{ marginTop: 20 }}>
          <AuthSection />
        </div>
      </div>
    </main>
  );
}
