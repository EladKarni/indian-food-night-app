import { SVGProps } from "react";

type DuplicateIconProps = {
  height?: number;
  width?: number;
  "aria-label"?: string;
  className?: string;
} & SVGProps<SVGSVGElement>;

const DuplicateIcon = ({
  height = 16,
  width = 16,
  "aria-label": ariaLabel,
  className = "",
  ...props
}: DuplicateIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={`text-slate-600 ${className}`}
    aria-label={ariaLabel || "Duplicate item"}
    {...props}
  >
    <path d="M384 96L384 0h-112c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48H464c26.51 0 48-21.49 48-48V128h-95.1C398.4 128 384 113.6 384 96zM416 0v96h96L416 0zM192 352V128h-144c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48h192c26.51 0 48-21.49 48-48L288 416h-32C220.7 416 192 387.3 192 352z"></path>
  </svg>
);

export default DuplicateIcon;
