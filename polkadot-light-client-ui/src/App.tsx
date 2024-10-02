import { useEffect, useState } from "react";
import { Header } from "@polkadot/types/interfaces";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { createMerkleTree } from "./utils/merkle-tree";
import HeaderList from "./components/HeaderList";

const BATCH_SIZE = 5;

function App() {
  const [tempHeaderBatch, setTempHeaderBatch] = useState<Header[]>([]);
  const [headers, setHeaders] = useState<Header[]>([]);

  useEffect(() => {
    const wsProvider = new WsProvider("wss://rpc.polkadot.io");

    ApiPromise.create({ provider: wsProvider })
      .then((api) => {
        console.log("Connected to Polkadot node");

        api.rpc.chain.subscribeNewHeads((header) => {
          console.log(`Received block header #${header.number.toNumber()}`);

          setTempHeaderBatch((prevBatch) => [...prevBatch, header]);
          setHeaders((prevHeaders) => [...prevHeaders, header]);
        });
      })
      .catch((error) => {
        console.error("Error connecting to Polkadot node:", error);
      });

    return () => {
      wsProvider.disconnect();
    };
  }, []);

  useEffect(() => {
    if (tempHeaderBatch.length === BATCH_SIZE) {
      createMerkleTree(tempHeaderBatch);

      setTempHeaderBatch([]);
    }
  }, [tempHeaderBatch]);

  console.log(headers);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Polkadot Block Headers</h1>
      <HeaderList headers={headers} />
    </div>
  );
}

export default App;
