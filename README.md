# Polkadot Block Header Light Client

This project is a Polkadot block header light client built using Polkadot API (`@polkadot/api`).

The application listens to incoming block headers from the Polkadot blockchain, groups them into batches, and stores them in Merkle Trees.

The Merkle Trees are used to generate inclusion proofs for each block header, which can be verified against the Merkle root. The project also includes a basic web interface that allows users to query block headers, view their inclusion status, and verify the generated proofs.

Such verification could be either automatic in batch or manually triggered by the user.

Project is deployed here -> [Polkadot Light Client](https://polkadot-light-client-snowy.vercel.app/)

---

## Application overview

1. **Batching of Block Headers**: The application listens to incoming Polkadot block headers and groups them in batches of a configurable size. Once the batch size limit is reached, a Merkle Tree is generated for that batch, and the headers are stored inside it.
2. **Merkle Tree Storage**: The generated Merkle Trees are stored in-memory and mapped to their corresponding block header ranges (start block to end block).
3. **Header Querying by Block Number or Hash**: Each header is queryable either by block number or hash using the stored Merkle Trees and inclusion proofs.
4. **Inclusion Proof Generation**: For every block header stored in a Merkle Tree, a Merkle inclusion proof can be generated.
5. **Proof Verification**: The generated Merkle proofs can be verified against the Merkle Tree root to ensure validity.
6. **UI Integration**: The UI provides real-time feedback by showing the block headers, their inclusion in Merkle Trees, and the verification status of the proofs.
7. **Batch Verification**: The application allows for asynchronous batch verification of headers.

---

## Features and Design Choices

### 1. **Batching Block Headers**

- The application listens to new Polkadot block headers in real time and groups them into batches of **5** (default `BATCH_SIZE`). Once a batch is complete, it is used to create a Merkle Tree.
- Grouping headers into batches reduces the computational overhead associated with Merkle Tree construction for each individual block.

**Alternative Approach**:

I thought about using a different number of headers per batch, but `5` was chosen as a balance between performance and efficiency.

- A smaller batch would result in a faster time for process headers, making the system more responsive. At the same time, it would mean more frequent Merkle Tree generation, which could be computationally expensive and increase memory cost.
- A bigger batch would reduce the number of Merkle Trees generated, but it could introduce delays before a batch is finalized.

### 2. **Merkle Tree Storage**

The current implementation uses an **in-memory** structure where each batch of headers is stored as leaves in a Merkle tree, and the corresponding tree and root are stored in the `merkleTrees` array. Each Merkle Tree is tied to a range of block numbers for easy querying.

### 3. **Querying Block Headers**

The querying mechanism consists of two key functions:

- `getHeaderByBlockNumber(blockNumber: number)`: it iterates through the leaves of all the Merkle trees and returns the header that matches the given block number.
- `getHeaderByBlockHash(blockHash: string)`: Similarly, this function traverses through the leaves to find the header with the matching block hash.

**Why didn't I use the merkle tree for queries**:

The Merkle Trees are mostly used for proof generation and verification, which is their primary purpose. I believe they are not optimized for querying data. The current approach indeed is `O(n)`, but it is simple and efficient for the current scale.

Merkle Patricia Trie would have been another option for queries, since it offers key-value storage with `Olog((n))` complexity. For this small project, I believe it would have been an overkill to implement this, since it requires more logic and structure.

### 4. **Merkle Proof Generation**

For every block header stored in a Merkle Tree, an inclusion proof can be generated and verified against the Merkle root. The Merkle Tree ensures that the data is not tampered with.

### 5. **Proof Verification**

The inclusion proofs generated for block headers can be verified against the Merkle Tree root providing a secure way to validate that a block header is part of the dataset. Those proof are generated just before the user decide to verify them.

The UI displays the block headers and their inclusion status in Merkle Trees. Users can manually verify the proof or enable batch verification, which is handled asynchronously. I wanted to give this 2 options so that
the user could see also the process of verification.

---

## Installation and Running the Project

### Prerequisites

- **npm** (or **yarn**)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Knos01/polkadot-light-client.git
   ```

2. **Navigate into the project directory**:

   ```bash
   cd polkadot-light-client
   ```

3. **Install the dependencies**:

   Using npm:

   ```bash
   npm install
   ```

   Using yarn:

   ```bash
   yarn install
   ```

4. **Run the project**:

   Using npm:

   ```bash
   npm start
   ```

   Using yarn:

   ```bash
   yarn start
   ```

5. **Access the application**:

   Open your browser and navigate to `http://localhost:3000`. The application will begin fetching and displaying block headers from the Polkadot blockchain.

---
