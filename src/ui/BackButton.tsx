import Link from "next/link";
import Icon from "./Icon";

interface BackButtonProps {
  href: string;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

const BackButton = ({ 
  href, 
  label = "Back", 
  showLabel = false,
  className = ""
}: BackButtonProps) => {
  return (
    <Link
      href={href}
      className={`text-slate-700 hover:text-slate-900 flex items-center space-x-2 transition-colors ${className}`}
    >
      <Icon name="back-arrow" size={20} />
      {showLabel && (
        <span className="text-sm font-medium">{label}</span>
      )}
    </Link>
  );
};

export default BackButton;