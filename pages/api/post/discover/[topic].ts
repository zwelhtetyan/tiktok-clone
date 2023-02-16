// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { topicPostsQuery } from '../../../../utils/queries';
import { Video } from '../../../../types';
import { client } from '../../../../utils/client';

type Data = {
  data: Video[] | [];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const topic = req.query.topic!;

    const query = topicPostsQuery(topic);

    const data: { data: Video[] } = await client.fetch(query);

    res.status(200).json(data);
  }
}
