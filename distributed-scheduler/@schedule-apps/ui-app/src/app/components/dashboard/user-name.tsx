import { getSession } from "@/app/actions/authenticate";

export async function UserName() {
	const session = await getSession();
	return (
		<span className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 md:border-r md:border-gray-300 py-2 pr-3 md:py-0 md:my-6 md:ps-6 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500">
			Hi, <strong>{session?.user?.name}</strong>
		</span>
	);
}
