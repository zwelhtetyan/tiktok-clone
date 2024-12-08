// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';
import { searchPostsQuery, searchUsersQuery } from '../../../utils/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const searchQuery = req.query.searchQuery as string;

    let searchedUsers, searchedPosts;

    try {
      searchedUsers = await client.fetch(searchUsersQuery(searchQuery));
    } catch (error) {
      console.log(error);
    }

    try {
      searchedPosts = await client.fetch(searchPostsQuery(searchQuery));
    } catch (error) {
      console.log(error);
    }

    const data = { searchedUsers, searchedPosts };

    res.status(200).json(data);
  }
}
