// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPostsByLimit } from '../../../utils/queries';
import { client } from '../../../utils/client';
import { Video } from '../../../types';

type Data = {
  data?: Video[];
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'GET') {
    const currentUserIdId = (req.query.currentUserId as string) || '';
    const query = getAllPostsByLimit(currentUserIdId);
    const data = await client.fetch(query);

    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const doc = req.body;

    await client.create(doc);

    res.status(201).json({ message: 'Posted successfully' });
  }
}
