// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../../utils/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    const query = req.query.id as string;
    const [postId, commentKey] = query.split(',');

    const data = await client
      .patch(postId)
      .unset([`comments[_key=="${commentKey}"]`])
      .commit();

    res.status(200).json(data);
  }
}
