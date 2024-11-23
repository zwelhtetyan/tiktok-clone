// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../../utils/client';
import { nanoid } from 'nanoid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    const { userId, postId, comment } = req.body;

    const data = await client
      .patch(postId)
      .setIfMissing({ comments: [] })
      .insert('after', 'comments[-1]', [
        {
          _key: nanoid(),
          comment,
          _type: 'comment',
          postedBy: { _ref: userId, _type: 'postedBy' },
        },
      ])
      .commit();

    res.status(200).json(data);
  }
}
