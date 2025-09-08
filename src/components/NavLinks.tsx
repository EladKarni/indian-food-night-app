import { navLinkList } from "@/constants/navLinks";
import Link from "next/link";

const NavLinks = () => {
    return (
        <nav className="flex items-center gap-6 max-lg:hidden">
            <ul className="flex items-center gap-6">
                {navLinkList.map((navLink) => (
                    <li key={navLink.url}>
                        <Link
                            className="relative text-secondary font-semibold text-md w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-off-white after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                            href={`/${navLink.url}`}
                        >
                            {navLink.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavLinks;