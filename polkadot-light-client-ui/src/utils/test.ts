import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";
import { Buffer } from "buffer";

export async function testMerkle() {
  // Hash the leaves using SHA256 and store them as buffers
  const leaves = ["a", "b", "c"].map((x) =>
    Buffer.from(
      SHA256(JSON.stringify({ first: x, second: 1 })).toString(),
      "hex"
    )
  );

  // Create the Merkle tree using the hashed leaves
  const merkleTree = new MerkleTree(leaves, (data: any) =>
    Buffer.from(SHA256(data).toString(), "hex")
  );

  // Get the root of the tree
  const root = merkleTree.getRoot().toString("hex");
  console.log("Merkle Tree Root:", root);

  // Get proof for a specific leaf (let's say the first one, 'a')
  const leaf = Buffer.from(
    SHA256(JSON.stringify({ first: "c", second: 1 })).toString(),
    "hex"
  ); // The hash of the first leaf
  console.log("before mapping", merkleTree.getProof(leaf));
  const proof = merkleTree.getProof(leaf).map((p) => p.data.toString("hex"));
  console.log("Merkle Proof:", proof);

  // Verify the proof
  const isValid = merkleTree.verify(proof, leaf, root);
  console.log("Proof is valid:", isValid);
}
