import type { NextApiRequest, NextApiResponse } from "next";
import { listVersions } from "../../../lib/libscv";

type Data = {
  versions: string[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const versions = await listVersions();
  res.status(200).json({ versions });
};

export default handler;
