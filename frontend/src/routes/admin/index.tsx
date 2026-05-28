import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/admin/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        return new Response(JSON.stringify({message: `hello ${(body as {name: string}).name}`}))
      }
    }
  }
})
