import { cn } from "@/util/utils";

type SubtitleTextPropsProps = {
  children: React.ReactNode;
  DarkMode?: boolean;
  sectionClasses?: string;
};

const SubtitleText = ({
  children,
  DarkMode,
  sectionClasses,
}: SubtitleTextPropsProps) => {
  return (
    <h2
      className={cn(
        "text-2xl sm:text-xl text-primary-content/80",
        {
          "text-base-200": DarkMode,
        },
        sectionClasses
      )}
    >
      {children}
    </h2>
  );
};

export default SubtitleText;
