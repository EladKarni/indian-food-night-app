import { SVGProps } from "react";

type LogoProps = {
  height?: number;
  width?: number;
  "aria-label"?: string;
  className?: string;
} & SVGProps<SVGSVGElement>;

const MenuIcon = ({
  height = 24,
  width = 24,
  "aria-label": ariaLabel,
  fill = "currentColor",
  className,
  ...props
}: LogoProps) => (
  <svg
    id="menu-icon"
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    viewBox="0 0 24 24"
    className="inline-block w-6 h-6 stroke-current"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    ></path>
  </svg>
);
export { MenuIcon };
