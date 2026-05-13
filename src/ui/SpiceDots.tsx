interface SpiceDotsProps {
  level: number;
  max?: number;
}

const SpiceDots = ({ level, max = 5 }: SpiceDotsProps) => {
  const filled = Math.round((level / 10) * max);
  return (
    <span className="ifn-dots">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={"ifn-dot" + (i < filled ? " on" : "")} />
      ))}
    </span>
  );
};

export default SpiceDots;
