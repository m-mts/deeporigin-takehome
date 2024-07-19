"use client";
import { usePathname } from "next/navigation";

export const MenuLink = ({ text, href }: { text: string; href: string }) => {
	const pathname = usePathname();
	const isActive = pathname.endsWith(href);
	const linkClass = isActive
		? "py-3 ps-px sm:px-3 font-medium text-blue-600 dark:text-blue-500"
		: "py-3 ps-px sm:px-3 font-medium text-gray-500 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500";
	return (
		<a className={linkClass} href={href} aria-current={isActive} role="link">
			{text}
		</a>
	);
};
