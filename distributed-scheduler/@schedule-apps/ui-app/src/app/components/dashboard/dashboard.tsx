import NavBar from "./navbar";

export default async function Dashboard({
	children,
}: { children: React.ReactNode | React.ReactNode[] }) {
	return (
		<>
			<NavBar />
			<main id="content">
				<div className="max-w-[85rem] mx-auto pt-12 pb-10 px-4 sm:px-6 lg:px-8 md:pt-24">
					{children}
				</div>
			</main>
		</>
	);
}
