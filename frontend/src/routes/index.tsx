import { getPhotos } from "#/lib/photos";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	loader: () => getPhotos({ data: { limit: 15, offset: 0 } }),
	component: HomePage,
});

function HomePage() {
	return (
		<>
			{/* Featured Sessions Section */}
			<section className="py-10 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-end justify-between mb-12">
						<div>
							<h1 className="font-display text-4xl md:text-5xl font-bold text-cream mb-3">
								Photos
							</h1>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
