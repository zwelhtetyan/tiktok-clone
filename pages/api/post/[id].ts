// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { postDetailQuery } from '../../../utils/queries';
import { client } from '../../../utils/client';

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'GET') {
    const videoId = req.query.id!;
    const currentUserId = (req.query.currentUserId as string) || '';

    const query = postDetailQuery(videoId, currentUserId);

    const data = await client.fetch(query);

    res.status(200).json(data[0]);
  } else if (req.method === 'DELETE') {
    const id = req.query.id! as string;

    await client.delete(id);

    res.status(200).json({ message: 'Successfully deleted!' });
  }
}
