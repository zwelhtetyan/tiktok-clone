// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';
import { nanoid } from 'nanoid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    const { userId, creatorId } = req.body;

    const updateCreator = await client
      .patch(creatorId)
      .setIfMissing({ follower: [] })
      .insert('after', 'follower[-1]', [
        { _key: nanoid(), _ref: userId, _type: 'postedBy' },
      ])
      .commit();

    // update user
    const updateUser = await client
      .patch(userId)
      .setIfMissing({ following: [] })
      .insert('after', 'following[-1]', [
        { _key: nanoid(), _ref: creatorId, _type: 'postedBy' },
      ])
      .commit();

    const data = await Promise.all([updateCreator, updateUser]);
    res.status(200).json(data);
  }
}
