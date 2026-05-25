import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 bg-(--header-bg) px-4 backdrop-blur-lg">
			<nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
				<h2 className="m-0 shrink-0 text-base font-semibold">
					<Link
						to="/"
						className="inline-flex items-center gap-2 bg-(--chip-bg) px-3 py-1.5 text-sm text-(--sea-ink)  no-underline sm:px-4 sm:py-2"
					>
						ojparkinson.photo
					</Link>
				</h2>
			</nav>
		</header>
	);
}
