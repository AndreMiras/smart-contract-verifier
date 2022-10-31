import { ok } from "assert";
import type { NextApiRequest, NextApiResponse } from "next";
import { compileExtractCompare } from "../../../lib/libscv";
import Web3 from "web3";

type Data = {
  matching: boolean;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    file,
    fileName,
    contractName,
    contractFilename,
    contractAddress,
    solcVersion,
  } = req.body;
  const sources = { [fileName]: file };
  ok(process.env.RPC_PROVIDER);
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.RPC_PROVIDER)
  );
  const matching = await compileExtractCompare(
    web3,
    sources,
    solcVersion,
    contractName,
    contractFilename,
    contractAddress
  );
  res.status(200).json({ matching });
};

export default handler;
