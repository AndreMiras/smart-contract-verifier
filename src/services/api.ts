import { ok } from "assert";
const verify = async (
  file: File,
  contractName: string,
  contractFilename: string,
  contractAddress: string,
  solcVersion: string
) => {
  const url = process.env.NEXT_PUBLIC_VERIFY_ENDPOINT;
  ok(url);
  const headers = {
    "content-type": "application/json",
    accept: "application/json",
  };
  const jsonData = {
    fileName: file.name,
    contractName,
    contractFilename,
    contractAddress,
    solcVersion,
    file: await file.text(),
  };
  const body = JSON.stringify(jsonData);
  const options = {
    method: "POST",
    body,
    headers,
  };
  const response = await fetch(url, options);
  return response.json();
};

const solcVersions = async () => {
  const url = process.env.NEXT_PUBLIC_SOLC_VERSIONS_ENDPOINT;
  ok(url);
  const headers = {
    "content-type": "application/json",
    accept: "application/json",
  };
  const options = { headers };
  const response = await fetch(url, options);
  return response.json();
};

export { verify, solcVersions };
