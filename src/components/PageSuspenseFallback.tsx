export default function PageSuspenseFallback() {
  return (
    <main className="ifn-screen ifn-app">
      <div className="ifn-suspense-fallback">
        <div className="ifn-display" style={{ fontSize: 22 }}>
          Loading…
        </div>
      </div>
    </main>
  );
}
