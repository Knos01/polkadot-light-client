import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";
import { Header } from "@polkadot/types/interfaces";

export const merkleTrees: { tree: MerkleTree; leaves: any[] }[] = [];
export const merkleRoots: string[] = [];
export interface LeafData {
  blockNumber: number;
  blockHash: string;
  header: string;
}

export function createMerkleTree(headers: Header[]) {
  const leaves = headers.map((hdr) => formatLeaf(hdr));

  const leafHashes = leaves.map((leaf) => leaf.hash);
  const merkleTree = new MerkleTree(leafHashes, SHA256);
  const root = merkleTree.getRoot().toString("hex");

  merkleTrees.push({ tree: merkleTree, leaves });
  merkleRoots.push(root);
}

export function getMerkleProof(headerData: Header): string[] | null {
  const { hash: leafHash } = formatLeaf(headerData);

  for (const { tree, leaves } of merkleTrees) {
    const index = leaves.findIndex((leaf) => leaf.hash === leafHash);
    if (index !== -1) {
      const proof = tree.getProof(leafHash).map((p) => p.data.toString("hex"));
      return proof;
    }
  }
  return null;
}

export function verifyMerkleProof(
  headerData: Header,
  proof: string[],
  merkleRoot: string
): boolean {
  const leafHash = formatLeaf(headerData).hash;

  const proofBuffers = proof.map((p) => Buffer.from(p, "hex"));
  const leafBuffer = Buffer.from(leafHash, "hex");
  const rootBuffer = Buffer.from(merkleRoot, "hex");

  const merkleTree = new MerkleTree([], SHA256);
  const isValid = merkleTree.verify(proofBuffers, leafBuffer, rootBuffer);
  return isValid;
}

export function formatLeaf(headerData: Header): {
  data: LeafData;
  hash: string;
} {
  const data: LeafData = {
    blockNumber: headerData.number.toNumber(),
    blockHash: headerData.hash.toHex(),
    header: headerData.toHex(),
  };
  const hash = SHA256(JSON.stringify(data)).toString();
  return { data, hash };
}
