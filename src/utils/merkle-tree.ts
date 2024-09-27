import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";

export function createMerkleTree(headers: string[]) {
  const leaves = headers.map((x) => SHA256(x).toString());
  const tree = new MerkleTree(leaves, SHA256);
  const root = tree.getRoot().toString("hex");
  console.log("Merkle Root:", root);
}
