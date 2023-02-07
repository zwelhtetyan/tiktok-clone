// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';
import { nanoid } from 'nanoid';
import { allUsersQuery } from '../../../utils/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const query = allUsersQuery();
    const data = await client.fetch(query);
    res.status(200).json(data);
  } else if (req.method === 'PUT') {
    const { userId, creatorId, follow } = req.body;

    if (follow) {
      // update creator
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
    } else {
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
}
