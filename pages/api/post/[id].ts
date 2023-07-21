// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { postDetailQuery } from "../../../utils/queries";
import { client } from "../../../utils/client";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const id = req.query.id!;

    const query = postDetailQuery(id);

    const data = await client.fetch(query);

    res.status(200).json(data[0]);
  } else if (req.method === "DELETE") {
    const id = req.query.id! as string;

    await client.delete(id);

    res.status(200).json({ message: "Successfully deleted!" });
  }
}
