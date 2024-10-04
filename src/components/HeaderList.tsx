import { Header } from "@polkadot/types/interfaces";
import CheckMark from "../assets/svg/CheckMark";
import { shortenString } from "../utils";
import Copy from "../assets/svg/Copy";

interface Props {
  headers: Header[];
  merkleTreeRanges: { startBlock: number; endBlock: number }[];
  verifyHeader: (header: Header) => void;
  verifiedProofHeaders: Set<string>;
}

const HASH_LENGTH = 10;

export default function HeaderList(props: Props) {
  const { headers, merkleTreeRanges, verifyHeader, verifiedProofHeaders } =
    props;

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
        const blockHash = header.hash.toHex();
        const proofVerified = verifiedProofHeaders.has(blockHash);
        const isMerkleTreeReady = isMerkleTreeCreatedForHeader(blockNumber);

        return (
          <div className="flex items-center justify-between p-2 border-b">
            <div>
              <p className="font-semibold">Block #{blockNumber}</p>
              <div className="text-sm text-white flex gap-2">
                Hash: {shortenString(blockHash, HASH_LENGTH)}{" "}
                <Copy
                  className="w-4 h-4 hover:cursor-pointer hover:opacity-70"
                  onClick={() => navigator.clipboard.writeText(blockHash)}
                />
              </div>
            </div>

            {isMerkleTreeReady ? (
              <span className="flex gap-2 items-center">
                Stored in Merkle Tree
                <CheckMark className="w-4 h-4" />
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
                onClick={() => verifyHeader(header)}
                disabled={!isMerkleTreeReady}
              >
                Verify Merkle Proof
              </button>
            ) : (
              <span className="flex gap-2 items-center">
                Proof verified
                <CheckMark className="w-4 h-4" />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
