import { NextResponse } from 'next/server';
import { client } from "@/sanity/client"

export async function POST(req: Request) {
  const { query } = await req.json();

  const results = await client.fetch(
    `*[_type == "forening" && Namn match $q]{
        _id,
        Namn,
        URL,
        "excerpt": Beskrivning[0].children[0].text
      }`,
    { q: `*${query}*` }
  );

  return NextResponse.json(results);
}
