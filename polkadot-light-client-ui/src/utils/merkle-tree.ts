import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";
import { Header } from "@polkadot/types/interfaces";
import { Buffer } from "buffer";

export const merkleTrees: { tree: MerkleTree; leaves: any[]; root: string }[] =
  [];
export interface LeafData {
  blockNumber: number;
  blockHash: string;
  header: string;
}

export function createMerkleTree(headers: Header[]) {
  const leaves = headers.map((hdr) => formatLeaf(hdr));
  const leafHashes = leaves.map((leaf) => Buffer.from(leaf.hash, "hex"));
  const merkleTree = new MerkleTree(leafHashes, (data: any) =>
    Buffer.from(SHA256(data).toString(), "hex")
  );

  const levels = merkleTree.getLayers();
  levels.forEach((level, index) => {
    console.log(
      `Level ${index}:`,
      level.map((node) => node.toString("hex"))
    );
  });

  const root = merkleTree.getRoot().toString("hex");
  console.log("Merkle Tree Root (creation):", root);

  merkleTrees.push({ tree: merkleTree, leaves, root });
}

export function getMerkleProof(
  headerData: Header
): { proof: string[]; root: string; tree: MerkleTree } | null {
  const { hash: leafHash } = formatLeaf(headerData);

  for (const { tree, leaves, root } of merkleTrees) {
    const index = leaves.findIndex((leaf) => leaf.hash === leafHash);
    if (index !== -1) {
      const proof = tree.getHexProof(Buffer.from(leafHash, "hex")); // Ensure Buffer is used for proof
      console.log("Merkle Proof (generation):", proof);
      return { proof, root, tree };
    }
  }
  return null;
}

export function verifyMerkleProof(
  headerData: Header,
  proof: string[],
  merkleRoot: string,
  merkleTree: MerkleTree
): boolean {
  console.log("Verifying for block number:", headerData.number.toNumber());
  console.log("Merkle Proof (verification):", proof);
  console.log("Merkle Root (verification):", merkleRoot);

  const leafHash = formatLeaf(headerData).hash;
  console.log("Leaf Hash (verification):", leafHash);

  const leafBuffer = Buffer.from(leafHash, "hex");
  const rootBuffer = Buffer.from(merkleRoot, "hex");

  const proofBuffers = proof.map((p) => Buffer.from(p, "hex"));

  const isValid = merkleTree.verify(proofBuffers, leafBuffer, rootBuffer);

  console.log("Proof is valid:", isValid);
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
  const serializedData = JSON.stringify(data);
  const hash = SHA256(serializedData).toString();
  return { data, hash };
}

export function getHeaderByBlockNumber(blockNumber: number): LeafData | null {
  for (const { leaves } of merkleTrees) {
    for (const leaf of leaves) {
      if (leaf.data.blockNumber === blockNumber) {
        return leaf.data;
      }
    }
  }
  console.warn(`Header not found for block number: ${blockNumber}`);
  return null;
}

export function getHeaderByBlockHash(blockHash: string): LeafData | null {
  for (const { leaves } of merkleTrees) {
    for (const leaf of leaves) {
      if (leaf.data.blockHash === blockHash) {
        return leaf.data;
      }
    }
  }
  console.warn(`Header not found for block hash: ${blockHash}`);
  return null;
}
