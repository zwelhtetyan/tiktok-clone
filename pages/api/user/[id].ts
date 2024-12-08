// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';
import {
  singleUserQuery,
  userCreatedPostsQuery,
  userLikedPostsQuery,
} from '../../../utils/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const userId = req.query.id as string;

    let user, userCreatedPosts, userLikedPosts;

    try {
      user = await client.fetch(singleUserQuery(userId));
    } catch (error) {
      console.log(error);
    }

    try {
      userCreatedPosts = await client.fetch(userCreatedPostsQuery(userId));
    } catch (error) {
      console.log(error);
    }

    try {
      userLikedPosts = await client.fetch(userLikedPostsQuery(userId));
    } catch (error) {
      console.log(error);
    }

    const data = { user: user[0], userCreatedPosts, userLikedPosts };

    res.status(200).json(data);
  }
}
