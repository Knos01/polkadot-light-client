import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";
import * as MerkleUtils from "./utils/merkle-tree";

let blockHeaderBatch: Header[] = [];
const BATCH_SIZE = 5;

async function main() {
  try {
    const wsProvider = new WsProvider("wss://rpc.polkadot.io");
    const api = await ApiPromise.create({ provider: wsProvider });

    console.log("Connected to the Polkadot node");
    console.log("Subscribing to new block headers");

    api.rpc.chain.subscribeNewHeads((header) => {
      console.log(`Block number: ${header.number}, Hash: ${header.hash}`);
      console.log(header);

      addBlockToBatch(header);
    });
  } catch (error) {
    console.error("Error initializing Polkadot API:", error);
    process.exit(1);
  }
}

function addBlockToBatch(header: Header) {
  blockHeaderBatch.push(header);

  if (blockHeaderBatch.length === BATCH_SIZE) {
    MerkleUtils.createMerkleTree(blockHeaderBatch);
    blockHeaderBatch = [];
  }
}

function getHeaderByBlockNumber(
  blockNumber: number
): MerkleUtils.LeafData | null {
  for (const { leaves } of MerkleUtils.merkleTrees) {
    for (const leaf of leaves) {
      if (leaf.data.blockNumber === blockNumber) {
        return leaf.data;
      }
    }
  }
  console.warn(`Header not found for block number: ${blockNumber}`);
  return null;
}

function getHeaderByBlockHash(blockHash: string): MerkleUtils.LeafData | null {
  for (const { leaves } of MerkleUtils.merkleTrees) {
    for (const leaf of leaves) {
      if (leaf.data.blockHash === blockHash) {
        return leaf.data;
      }
    }
  }
  console.warn(`Header not found for block hash: ${blockHash}`);
  return null;
}

main();
