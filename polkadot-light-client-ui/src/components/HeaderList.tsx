// src/components/HeaderList.tsx

import React from "react";
import { Header } from "@polkadot/types/interfaces";

interface Props {
  headers: Header[];
  validatedHeaders?: Set<number>;
}

export default function HeaderList(props: Props) {
  const { headers, validatedHeaders } = props;

  console.log(headers);

  return (
    <div>
      {headers.map((header) => {
        const blockNumber = header.number.toNumber();

        return (
          <div
            key={blockNumber}
            className="flex items-center justify-between p-2 border-b"
          >
            <div>
              <p className="font-semibold">Block #{blockNumber}</p>
              <p className="text-sm text-gray-600">
                Hash: {header.hash.toHex()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
