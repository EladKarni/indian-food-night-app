"use client";

interface HostBylineProps {
  hostName: string;
  loading: boolean;
}

export default function HostByline({ hostName, loading }: HostBylineProps) {
  if (loading) {
    return (
      <span
        className="ifn-skel"
        style={{
          display: "inline-block",
          width: 120,
          height: 12,
          verticalAlign: "middle",
        }}
      />
    );
  }
  return <>Hosted by {hostName}</>;
}
