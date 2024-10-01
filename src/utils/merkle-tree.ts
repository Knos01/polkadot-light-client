import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";
import { Header } from "@polkadot/types/interfaces";

export const merkleTrees: { tree: MerkleTree; leaves: any[] }[] = [];
export const merkleRoots: string[] = [];

export function createMerkleTree(headers: Header[]) {
  const leaves = headers.map((hdr) => {
    const data = {
      blockNumber: hdr.number.toNumber(),
      blockHash: hdr.hash.toHex(),
      header: hdr.toHex(),
    };
    const hash = SHA256(JSON.stringify(data));
    return { data, hash };
  });

  const leafHashes = leaves.map((leaf) => leaf.hash);
  const merkleTree = new MerkleTree(leafHashes, SHA256);
  const root = merkleTree.getRoot().toString("hex");

  merkleTrees.push({ tree: merkleTree, leaves });
  merkleRoots.push(root);
}
