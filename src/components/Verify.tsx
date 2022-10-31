import { useContext, useEffect, useState } from "react";
import * as api from "../services/api";

const Verify = () => {
  const [verifyStatus, setVerifyStatus] = useState<string>("N/A");
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [contractName, setContractName] = useState<string>("");
  const [contractFilename, setContractFilename] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [solcVersions, setSolcVersions] = useState<string[]>(["loading..."]);
  const [solcVersion, setSolcVersion] = useState<string>("");

  const onFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { files } = event.target;
    if (files !== null && files !== undefined) {
      setFile(files[0]);
    }
  };

  // soljson-v0.4.24+commit.e67f0147.js -> v0.4.24+commit.e67f0147
  const extractVersion = (name: string) =>
    name.slice("soljson-".length, -".js".length);

  const onVersion = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target;
    const version = extractVersion(value);
    setSolcVersion(version);
  };

  const isSolFile = (file: string) => file.slice(-4) === ".sol";

  const fileStem = (file: string) => file.slice(0, -".sol".length);

  // load the list of solc versions
  useEffect(() => {
    const loadVersions = async () => {
      const { versions } = await api.solcVersions();
      setSolcVersions(versions);
      setSolcVersion(extractVersion(versions[0]));
    };
    loadVersions();
  }, []);

  // update contractName and contractFilename on file update
  useEffect(() => {
    if (!file) return;
    if (!isSolFile(file.name))
      throw new Error("Only .sol file extension is supported");
    const stem = fileStem(file.name);
    setContractName(stem);
    setContractFilename(file.name);
  }, [file]);

  const onFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!file) return;
    if (file) {
      setLoading(true);
      try {
        const { matching } = await api.verify(
          file,
          contractName,
          contractFilename,
          contractAddress,
          solcVersion
        );
        setVerifyStatus((matching && "Matching") || "Not matching");
      } catch (error: unknown) {
        setVerifyStatus("Error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div>
      <form onSubmit={onFormSubmit}>
        <p>
          <label>Contract Name: </label>
          <input
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
          />
        </p>
        <p>
          <label>Contract File Name: </label>
          <input
            type="text"
            value={contractFilename}
            onChange={(e) => setContractFilename(e.target.value)}
          />
        </p>
        <p>
          <label>Contract Address: </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </p>
        <p>
          <label>Solidity Compiler Version: </label>
          <select onChange={onVersion}>
            {solcVersions?.length &&
              solcVersions.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
          </select>
        </p>
        <p>
          <input type="file" name="file" onChange={onFile} />
        </p>
        <p>
          <input type="submit" value="Submit" />
        </p>
      </form>
      <p>Verify status: {(loading && "loading...") || verifyStatus}</p>
    </div>
  );
};

export default Verify;
