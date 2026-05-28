import { createFileRoute, isRedirect } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { getRequest } from "@tanstack/react-start/server";

export const Route = createFileRoute("/admin/upload")({
	server: {
		handlers: {
			POST: async () => {
				const request = getRequest();
				console.log(request);
				const db = await env?.photos_meta;
				const bucket = await env?.photos;

				if (!db || !bucket) {
					throw new Error("failed to load storage");
				}

				const formData = await request.formData();
				const file = formData.get("file") as File | null;
				const thumbnail = formData.get("thumbnail") as File | null;
				const title = formData.get("title") as string;
				const date = formData.get("date") as string;
				const camera = formData.get("camera") as string;
				const lens = formData.get("lens") as string;
				const aperture = formData.get("aperture") as string;
				const exposure = formData.get("exposure") as string;
				const focalLength = formData.get("focalLength") as string;
				const iso = formData.get("iso") as string;
				const make = formData.get("make") as string;
				const blurData = formData.get("blur_data") as string;

				if (!file || !title || !date) {
					throw new Error("File, title, and date are required");
				}

				const slug = title
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, "");

				const existing = await db
					.prepare("SELECT id FROM photos WHERE slug = ?")
					.bind(slug)
					.first();

				if (existing) {
					throw new Error("A photo with this title already exists");
				}

				const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
				const imageKey = `${slug}.${ext}`;
				const thumbKey = `${slug}-thumb.jpg`;

				try {
					// Upload original image to R2
					const fileBuffer = await file.arrayBuffer();
					await bucket.put(imageKey, fileBuffer, {
						httpMetadata: {
							contentType: file.type,
						},
					});

					if (thumbnail) {
						const thumbBuffer = await thumbnail.arrayBuffer();
						await bucket.put(thumbKey, thumbBuffer, {
							httpMetadata: {
								contentType: "image/jpeg",
							},
						});
					} else {
						// If no thumbnail provided, use original as thumbnail
						await bucket.put(thumbKey, fileBuffer, {
							httpMetadata: {
								contentType: file.type,
							},
						});
					}

					const r2Result = await db
						.prepare(
							`INSERT INTO photos (slug, title, date, image_key, thumb_key, camera, lens, aperture, exposure, focal_length, iso, make, blur_data)
					 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
						)
						.bind(
							slug,
							title,
							date,
							imageKey,
							thumbKey,
							camera || null,
							lens || null,
							aperture || null,
							exposure || null,
							focalLength || null,
							iso || null,
							make || null,
							blurData || null,
						)
						.run();

					console.log({ r2Result });

					return new Response();
				} catch (err) {
					if (isRedirect(err)) {
						throw err; // Re-throw redirects
					}
					const errorMessage = err instanceof Error ? err.message : String(err);
					console.error("Upload error:", errorMessage, err);
					throw new Error(`Failed to upload photo: ${errorMessage}`);
				}
			},
		},
	},
});
