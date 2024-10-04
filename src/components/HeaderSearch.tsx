import { useState } from "react";
import {
  getHeaderByBlockNumber,
  getHeaderByBlockHash,
  LeafData,
} from "../utils/merkle-tree";
import { shortenString } from "../utils";
import Copy from "../assets/svg/Copy";

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
    <div className="flex flex-col gap-3">
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
        <div className="p-5 bg-gray-800 rounded-xl">
          <h2 className="text-xl">Your search result:</h2>
          <p>
            Block:{" "}
            <span className="text-white">#{searchResult.blockNumber}</span>{" "}
          </p>
          <p>
            Hash: <span className="text-white">{searchResult.blockHash}</span>
          </p>
          <p className="flex flex-row gap-2">
            Header hex:{" "}
            <span className="text-white">
              {shortenString(searchResult.header, 20)}
            </span>
            <Copy
              className="w-4 h-4 hover:cursor-pointer hover:opacity-70"
              onClick={() => navigator.clipboard.writeText(searchResult.header)}
            />
          </p>
        </div>
      )}
    </div>
  );
}

export default HeaderSearch;
