import { Header } from "@polkadot/types/interfaces";
import * as MerkleTreeUtils from "../utils/merkle-tree";
import { useState } from "react";

interface Props {
  headers: Header[];
}

export default function HeaderList(props: Props) {
  const { headers } = props;
  const [verifiedProofHeaders, setVerifiedProofHeaders] = useState<Set<number>>(
    new Set()
  );

  const verifyProof = (header: Header) => {
    const proofData = MerkleTreeUtils.getMerkleProof(header);
    if (proofData) {
      const { proof, root, tree } = proofData;

      const isValid = MerkleTreeUtils.verifyMerkleProof(
        header,
        proof,
        root,
        tree
      );

      if (isValid) {
        console.log(
          `Merkle proof verified for block #${header.number.toNumber()}`
        );

        setVerifiedProofHeaders((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.add(header.number.toNumber());
          return updatedSet;
        });
      } else {
        console.warn(
          `Merkle proof verification failed for block #${header.number.toNumber()}`
        );
      }
    } else {
      console.warn(
        `No Merkle proof found for block #${header.number.toNumber()}`
      );
    }
  };

  return (
    <div>
      {headers.map((header) => {
        const blockNumber = header.number.toNumber();
        const proofVerified = verifiedProofHeaders.has(blockNumber);

        return (
          <div className="flex items-center justify-between p-2 border-b">
            <div>
              <p className="font-semibold">Block #{blockNumber}</p>
              <p className="text-sm text-gray-600">
                Hash: {header.hash.toHex()}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {proofVerified && (
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}

              {!proofVerified && (
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => verifyProof(header)}
                >
                  Verify Merkle Proof
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
