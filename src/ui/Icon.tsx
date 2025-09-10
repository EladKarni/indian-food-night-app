import { SVGProps } from "react";
import { clsx } from "clsx";

export type IconName = 
  | "person" 
  | "mail" 
  | "phone" 
  | "duplicate" 
  | "menu"
  | "logo"
  | "back-arrow"
  | "lock"
  | "location"
  | "user"
  | "loading";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number | string;
  className?: string;
}

const iconPaths: Record<IconName, React.ReactElement> = {
  person: (
    <path d="M511.728 64c108.672 0 223.92 91.534 223.92 159.854v159.92c0 61.552-25.6 179.312-94.256 233.376a63.99 63.99 0 0 0-23.968 57.809c2.624 22.16 16.592 41.312 36.848 50.625l278.496 132.064c2.176.992 26.688 5.104 26.688 39.344l.032 62.464L64 959.504V894.56c0-25.44 19.088-33.425 26.72-36.945l281.023-132.624c20.16-9.248 34.065-28.32 36.769-50.32 2.72-22-6.16-43.84-23.456-57.712-66.48-53.376-97.456-170.704-97.456-233.185v-159.92C287.615 157.007 404.016 64 511.728 64zm0-64.002c-141.312 0-288.127 117.938-288.127 223.857v159.92c0 69.872 31.888 211.248 121.392 283.088l-281.04 132.64S.001 827.999.001 863.471v96.032c0 35.344 28.64 63.968 63.951 63.968h895.552c35.344 0 63.968-28.624 63.968-63.968v-96.032c0-37.6-63.968-63.968-63.968-63.968L681.008 667.439c88.656-69.776 118.656-206.849 118.656-283.665v-159.92c0-105.92-146.64-223.855-287.936-223.855z" />
  ),
  mail: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.5 5.25L2.25 4.5H21.75L22.5 5.25V18.75L21.75 19.5H2.25L1.5 18.75V5.25ZM3 6.8025V18H21V6.804L12.465 13.35H11.55L3 6.8025ZM19.545 6H4.455L12 11.8035L19.545 6Z"
    />
  ),
  phone: (
    <>
      <g clipPath="url(#clip0_5_43)">
        <path d="M16.5 1.5C16.8978 1.5 17.2794 1.65804 17.5607 1.93934C17.842 2.22064 18 2.60218 18 3V21C18 21.3978 17.842 21.7794 17.5607 22.0607C17.2794 22.342 16.8978 22.5 16.5 22.5H7.5C7.10218 22.5 6.72064 22.342 6.43934 22.0607C6.15804 21.7794 6 21.3978 6 21V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H16.5ZM7.5 0C6.70435 0 5.94129 0.316071 5.37868 0.87868C4.81607 1.44129 4.5 2.20435 4.5 3V21C4.5 21.7956 4.81607 22.5587 5.37868 23.1213C5.94129 23.6839 6.70435 24 7.5 24H16.5C17.2956 24 18.0587 23.6839 18.6213 23.1213C19.1839 22.5587 19.5 21.7956 19.5 21V3C19.5 2.20435 19.1839 1.44129 18.6213 0.87868C18.0587 0.316071 17.2956 0 16.5 0L7.5 0Z" />
        <path d="M12 21C12.3978 21 12.7794 20.842 13.0607 20.5607C13.342 20.2794 13.5 19.8978 13.5 19.5C13.5 19.1022 13.342 18.7206 13.0607 18.4393C12.7794 18.158 12.3978 18 12 18C11.6022 18 11.2206 18.158 10.9393 18.4393C10.658 18.7206 10.5 19.1022 10.5 19.5C10.5 19.8978 10.658 20.2794 10.9393 20.5607C11.2206 20.842 11.6022 21 12 21Z" />
      </g>
      <defs>
        <clipPath id="clip0_5_43">
          <rect width={24} height={24} />
        </clipPath>
      </defs>
    </>
  ),
  duplicate: (
    <path d="M384 96L384 0h-112c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48H464c26.51 0 48-21.49 48-48V128h-95.1C398.4 128 384 113.6 384 96zM416 0v96h96L416 0zM192 352V128h-144c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48h192c26.51 0 48-21.49 48-48L288 416h-32C220.7 416 192 387.3 192 352z" />
  ),
  menu: (
    <path d="M3 12h18M3 6h18M3 18h18" />
  ),
  logo: (
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  ),
  "back-arrow": (
    <path d="M19 12H5M12 19l-7-7 7-7" />
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <circle cx="12" cy="16" r="1" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  location: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  loading: (
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
  )
};

const iconViewBoxes: Record<IconName, string> = {
  person: "0 0 1024 1024",
  mail: "0 0 24 24", 
  phone: "0 0 24 24",
  duplicate: "0 0 512 512",
  menu: "0 0 24 24",
  logo: "0 0 24 24",
  "back-arrow": "0 0 24 24",
  user: "0 0 24 24",
  lock: "0 0 24 24",
  location: "0 0 24 24",
  loading: "0 0 24 24"
};

const Icon = ({ 
  name, 
  size = 24, 
  className = "", 
  ...props 
}: IconProps) => {
  const viewBox = iconViewBoxes[name];
  const iconPath = iconPaths[name];

  if (!iconPath) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx("inline-block", className)}
      {...props}
    >
      {iconPath}
    </svg>
  );
};

export default Icon;