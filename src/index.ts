import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";
import * as MerkleUtils from "./utils/merkle-tree";

let blockHeaderBatch: Header[] = [];
const BATCH_SIZE = 5;

async function main() {
  const wsProvider = new WsProvider("wss://rpc.polkadot.io");
  const api = await ApiPromise.create({ provider: wsProvider });

  console.log("Connected to the Polkadot node");

  console.log("Subscribing to new block headers");

  api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Block number: ${header.number}, Hash: ${header.hash}`);

    addBlockToBatch(header);
  });
}

function addBlockToBatch(header: Header) {
  blockHeaderBatch.push(header);

  if (blockHeaderBatch.length === BATCH_SIZE) {
    MerkleUtils.createMerkleTree(blockHeaderBatch);
    blockHeaderBatch = [];
  }
}

main();
