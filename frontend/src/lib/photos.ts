import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";

type Photo = {
	id: string;
	date: string;
	// ...other columns
};

export const getPhotos = createServerFn({ method: "GET" })
	.inputValidator((input: { limit?: number; offset?: number } = {}) => input)
	.handler(async () => {
		const { results } = await env.photos_meta
			.prepare("SELECT * FROM photos ")
			.all<Photo>();
		return results;
	});
