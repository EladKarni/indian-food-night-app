import { cn } from "@/util/utils";

type TitleTextProps = {
  children: React.ReactNode;
  DarkMode?: boolean;
  sectionClasses?: string;
};

const TitleText = ({ children, DarkMode, sectionClasses }: TitleTextProps) => {
  return (
    <h2
      className={cn(
        "text-4xl sm:text-4xl text-base-300",
        {
          "text-base-100": DarkMode,
        },
        sectionClasses
      )}
    >
      {children}
    </h2>
  );
};

export default TitleText;
