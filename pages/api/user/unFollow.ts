// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    const { userId, creatorId } = req.body;

    // update creator
    const updateCreator = await client
      .patch(creatorId)
      .unset([`follower[_ref=="${userId}"]`])
      .commit();

    // update user
    const updateUser = await client
      .patch(userId)
      .unset([`following[_ref=="${creatorId}"]`])
      .commit();

    const data = await Promise.all([updateCreator, updateUser]);
    res.status(200).json(data);
  }
}
