import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: '2qv2ei73',
  dataset: 'production',
  apiVersion: '2023-01-22',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
