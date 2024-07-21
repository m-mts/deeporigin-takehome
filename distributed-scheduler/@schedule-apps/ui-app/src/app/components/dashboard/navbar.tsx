import { LogoutButton } from "./logout-button";
import Link from "next/link";
import { UserName } from "./user-name";
import { MenuLink } from "./menu-link";

export default async function NavBar() {
	return (
		<header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm">
			<nav
				className="mt-6 relative max-w-[85rem] w-full bg-white border border-gray-200 rounded-[36px] mx-2 py-3 px-4 md:flex md:items-center md:justify-between md:py-0 md:px-6 lg:px-8 xl:mx-auto dark:bg-neutral-800 dark:border-neutral-700"
				aria-label="Global"
			>
				<div className="flex items-center justify-between">
					<Link
						className="flex-none text-xl font-semibold dark:text-white"
						href="/dashboard"
						aria-label="Brand"
					>
						// distributed scheduler
					</Link>
				</div>
				<div
					id="navbar-collapse-with-animation"
					className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block"
				>
					<div className="flex flex-col md:flex-row md:items-center md:justify-end py-2 md:py-0 md:ps-7">
						<UserName />
						<MenuLink text="Schedule" href="/dashboard" />
						<MenuLink text="Add task" href="/dashboard/add-task" />
						<LogoutButton />
					</div>
				</div>
			</nav>
		</header>
	);
}
