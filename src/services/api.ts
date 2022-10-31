const verify = async (
  file: File,
  contractName: string,
  contractFilename: string,
  contractAddress: string,
  solcVersion: string
) => {
  const url = "/api/v1/verify";
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

export { verify };
