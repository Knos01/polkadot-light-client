import { useEffect, useState, useRef } from "react";
import { Header } from "@polkadot/types/interfaces";
import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  createMerkleTree,
  getMerkleProof,
  merkleTrees,
  verifyMerkleProof,
} from "./utils/merkle-tree";
import HeaderList from "./components/HeaderList";

export const BATCH_SIZE = 5;

function App() {
  const [headers, setHeaders] = useState<Header[]>([]);
  const [merkleTreeRanges, setMerkleTreeRanges] = useState<
    { startBlock: number; endBlock: number }[]
  >([]);
  const [verifiedProofHeaders, setVerifiedProofHeaders] = useState<Set<number>>(
    new Set()
  );
  const tempBatchRef = useRef<Header[]>([]);

  useEffect(() => {
    const wsProvider = new WsProvider("wss://rpc.polkadot.io");

    ApiPromise.create({ provider: wsProvider })
      .then((api) => {
        console.log("Connected to Polkadot node");

        const unsubscribe = api.rpc.chain.subscribeNewHeads((header) => {
          console.log(`Received block header #${header.number.toNumber()}`);

          tempBatchRef.current = [...tempBatchRef.current, header];

          setHeaders((prevHeaders) => [...prevHeaders, header]);

          if (tempBatchRef.current.length === BATCH_SIZE) {
            console.log("Batch size reached. Creating Merkle tree...");
            const { startBlock, endBlock } = createMerkleTree(
              tempBatchRef.current
            );

            setMerkleTreeRanges((prevRanges) => [
              ...prevRanges,
              { startBlock, endBlock },
            ]);

            const batchToVerify = [...tempBatchRef.current];
            batchVerifyHeaders(batchToVerify);

            tempBatchRef.current = [];
          }
        });

        return unsubscribe;
      })
      .catch((error) => {
        console.error("Error connecting to Polkadot node:", error);
      });

    return () => {
      wsProvider.disconnect();
    };
  }, []);

  const batchVerifyHeaders = async (batch: Header[]) => {
    await Promise.all(batch.map(async (header) => verifyHeader(header)));
  };

  const verifyHeader = (header: Header) => {
    const proofData = getMerkleProof(header);
    if (proofData) {
      const { proof, root, tree } = proofData;
      const isValid = verifyMerkleProof(header, proof, root, tree);

      if (isValid) {
        console.log(
          `Merkle proof verified for block #${header.number.toNumber()}`
        );

        setVerifiedProofHeaders((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.add(header.number.toNumber());
          return updatedSet;
        });
      } else {
        console.warn(
          `Merkle proof verification failed for block #${header.number.toNumber()}`
        );
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Polkadot Block Headers fetched {headers.length}
      </h1>
      <h2>Merkle trees generated {merkleTrees.length}</h2>
      <HeaderList
        headers={headers}
        merkleTreeRanges={merkleTreeRanges}
        verifiedProofHeaders={verifiedProofHeaders}
        verifyHeader={verifyHeader}
      />
      Fetching Block Headers...
    </div>
  );
}

export default App;
