import { useState } from "react";
import {
  getHeaderByBlockNumber,
  getHeaderByBlockHash,
  LeafData,
} from "../utils/merkle-tree";

function HeaderSearch() {
  const [blockNumber, setBlockNumber] = useState("");
  const [blockHash, setBlockHash] = useState("");
  const [searchResult, setSearchResult] = useState<LeafData | null>(null);

  const searchByBlockNumber = () => {
    setBlockHash("");
    setSearchResult(null);

    const result = getHeaderByBlockNumber(Number(blockNumber));
    if (result) {
      setSearchResult(result);
    } else {
      alert("Block header not found");
    }
  };

  const searchByBlockHash = () => {
    setBlockNumber("");
    setSearchResult(null);

    const result = getHeaderByBlockHash(blockHash);
    if (result) {
      setSearchResult(result);
    } else {
      alert("Block header not found");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-6">
        <div className="flex flex-row w-1/3 gap-3">
          <input
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Search by Block Number"
            value={blockNumber}
            onChange={(e) => setBlockNumber(e.target.value)}
          />
          <button
            onClick={searchByBlockNumber}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Search
          </button>
        </div>
        <div className="flex flex-row w-1/3 gap-3">
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Search by Block Hash"
            value={blockHash}
            onChange={(e) => setBlockHash(e.target.value)}
          />
          <button
            onClick={searchByBlockHash}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Search
          </button>
        </div>
      </div>
      {searchResult && (
        <div>
          <p>Block #{searchResult.blockNumber}</p>
          <p>Hash: {searchResult.blockHash}</p>
        </div>
      )}
    </div>
  );
}

export default HeaderSearch;
