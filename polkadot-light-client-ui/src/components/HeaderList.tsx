import { Header } from "@polkadot/types/interfaces";
import * as MerkleTreeUtils from "../utils/merkle-tree";
import { useState } from "react";
import CheckMark from "../assets/svg/CheckMark";
import { shortenString } from "../utils";
import Copy from "../assets/svg/Copy";

interface Props {
  headers: Header[];
  merkleTreeRanges: { startBlock: number; endBlock: number }[];
}

const HASH_LENGTH = 10;

export default function HeaderList(props: Props) {
  const { headers, merkleTreeRanges } = props;
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

  const isMerkleTreeCreatedForHeader = (blockNumber: number) => {
    return merkleTreeRanges.some(
      (range) =>
        blockNumber >= range.startBlock && blockNumber <= range.endBlock
    );
  };

  return (
    <div>
      {headers.map((header) => {
        const blockNumber = header.number.toNumber();
        const proofVerified = verifiedProofHeaders.has(blockNumber);
        const isMerkleTreeReady = isMerkleTreeCreatedForHeader(blockNumber);

        return (
          <div className="flex items-center justify-between p-2 border-b">
            <div>
              <p className="font-semibold">Block #{blockNumber}</p>
              <button
                className="text-sm text-gray-600 flex gap-2"
                onClick={() =>
                  navigator.clipboard.writeText(header.hash.toHex())
                }
              >
                Hash: {shortenString(header.hash.toHex(), HASH_LENGTH)}{" "}
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {isMerkleTreeReady ? (
              <span className="flex gap-2">
                Stored in Merkle Tree
                <CheckMark />
              </span>
            ) : (
              <span className="flex gap-2">
                Waiting for Merkle Tree generation
                <svg
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            )}

            {!proofVerified ? (
              <button
                className={`${
                  isMerkleTreeReady
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-500"
                } text-white px-2 py-1 rounded `}
                onClick={() => verifyProof(header)}
                disabled={!isMerkleTreeReady}
              >
                Verify Merkle Proof
              </button>
            ) : (
              <span className="flex gap-2">
                Proof verified
                <CheckMark />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
