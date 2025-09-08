import { Logo } from "@/ui/icons/logo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-base-200 flex flex-col justify-center items-center py-8">
      <Link
        href="/"
        className="text-white font-bold text-2xl"
        aria-label="Navigate to Home Page of BrontoSource.dev"
      >
        <Logo fill="black" />
      </Link>
      <div className="text-center">
        <p className="italic mt-4">&copy; 2024 Lorem ipsum</p>
      </div>
    </footer>
  );
};

export default Footer;
