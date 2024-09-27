import { ApiPromise, WsProvider } from "@polkadot/api";

async function main() {
  const wsProvider = new WsProvider("wss://rpc.polkadot.io");
  const api = await ApiPromise.create({ provider: wsProvider });

  console.log("Connected to the Polkadot node");

  console.log("Subscribing to new block headers");

  api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Block number: ${header.number}, Hash: ${header.hash}`);
  });
}

main();
