import Web3 from "web3";
const solc = require("solc");

const isOptimized = 1;

const extractMinorPatch = (solcVersion: string) => {
  // Semantic versioning
  const matchMajorMinorPatch = (v: string) =>
    v.match(/v\d+?\.\d+?\.\d+?[+-]/gi);
  const matchMinorPatch = (v: string) => v.match(/\.\d+/g);
  const majorMinorPatch = matchMajorMinorPatch(solcVersion);
  const minorPatch =
    majorMinorPatch === null ? null : matchMinorPatch(majorMinorPatch[0]);
  if (minorPatch === null) {
    throw new Error("Could not extract version");
  }
  const minor = parseInt(minorPatch[0].slice(1));
  const patch = parseInt(minorPatch[1].slice(1));
  return [minor, patch];
};

/**
 * Extract the relevant part of the bytecode exlucluding metadata.
 */
const processBytecode = (bytecode: string, solcVersion: string) => {
  const [solcMinor, solcPatch] = extractMinorPatch(solcVersion);
  var startingPoint = 0;
  var endingPoint = bytecode.length;
  if (solcMinor >= 4 && solcPatch >= 22) {
    startingPoint = bytecode.lastIndexOf("6080604052");
    endingPoint = bytecode.search("a165627a7a72305820");
  } else if (solcMinor >= 4 && solcPatch >= 7) {
    startingPoint = bytecode.lastIndexOf("6060604052");
    endingPoint = bytecode.search("a165627a7a72305820");
  }
  return bytecode.slice(startingPoint, endingPoint);
};

const solcCache: Record<string, any> = {};

const loadSolc = async (version: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (solcCache[version] !== undefined) resolve(solcCache[version]);
    else
      solc.loadRemoteVersion(version, (error: unknown, solcInstance: any) => {
        solcCache[version] = solcInstance;
        return error ? reject(error) : resolve(solcInstance);
      });
  });
};

const compileExtract = async (
  sources: any,
  solcVersion: string,
  contractName: string,
  contractFilename: string
) => {
  const solcInstance = await loadSolc(solcVersion);
  const output = JSON.parse(
    solcInstance.lowlevel.compileMulti(JSON.stringify({ sources }), isOptimized)
  );
  const compiledBytecode =
    "0x" +
    output["contracts"][contractFilename + ":" + contractName][
      "runtimeBytecode"
    ];
  return compiledBytecode;
};

const compileExtractCompare = async (
  web3: Web3,
  sources: any,
  solcVersion: string,
  contractName: string,
  contractFilename: string,
  contractAddress: string
) => {
  const compiledBytecode = await compileExtract(
    sources,
    solcVersion,
    contractName,
    contractFilename
  );
  const blockchainBytecode = await web3.eth.getCode(contractAddress);
  const processedCompiledBytecode = processBytecode(
    compiledBytecode,
    solcVersion
  );
  const processedBlockchainBytecode = processBytecode(
    blockchainBytecode,
    solcVersion
  );
  return processedBlockchainBytecode === processedCompiledBytecode;
};

export { compileExtractCompare };
