import sanityClient, { SanityClient } from "@sanity/client";
// import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = sanityClient({
  projectId: '58nl9cc2',
  dataset: "production",
  apiVersion: "2023-02-21",
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

// const builder = imageUrlBuilder(client);

// export const urlFor = (source: SanityImageSource) => builder.image(source);
