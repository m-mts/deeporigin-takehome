import LogoutIcon from "@mui/icons-material/Logout";

import Link from "next/link";

export function LogoutButton() {
	return (
		<Link
			href="/logout"
			className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 md:border-s md:border-gray-300 py-2 md:py-0 md:my-6 md:ps-6 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500"
		>
			<LogoutIcon />
			Logout
		</Link>
	);
}
