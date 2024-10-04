import { useEffect, useState, useRef } from "react";
import { Header } from "@polkadot/types/interfaces";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { createMerkleTree } from "./utils/merkle-tree";
import HeaderList from "./components/HeaderList";

export const BATCH_SIZE = 5;

function App() {
  const [headers, setHeaders] = useState<Header[]>([]);
  const [merkleTreeRanges, setMerkleTreeRanges] = useState<
    { startBlock: number; endBlock: number }[]
  >([]);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Polkadot Block Headers</h1>
      <HeaderList headers={headers} merkleTreeRanges={merkleTreeRanges} />
    </div>
  );
}

export default App;
