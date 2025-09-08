import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  link: string;
}

const Button = ({ children, link }: ButtonProps) => {
  return (
    <Link
      className="btn max-w-fit bg-primary px-8 hover:bg-primary/40 duration-200 hover:text-black font-semibold uppercase border-0"
      href={link}
    >
      {children}
    </Link>
  );
};

export default Button;
