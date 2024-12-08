// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';
import { nanoid } from 'nanoid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    const { userId, postId } = req.body;

    const data = await client
      .patch(postId)
      .setIfMissing({ likes: [] })
      .insert('after', 'likes[-1]', [
        { _key: nanoid(), _ref: userId, _type: 'postedBy' },
      ])
      .commit();

    res.status(200).json(data);
  }
}
