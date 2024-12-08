// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    const { userId, bio } = req.body;

    const data = await client
      .patch(userId)
      .setIfMissing({ bio: '' })
      .set({ bio })
      .commit();

    res.status(200).json(data);
  }
}
