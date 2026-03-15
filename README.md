# Document Knowledge Assistant (RAG System)

## Overview

The Document Knowledge Assistant is a Retrieval-Augmented Generation (RAG) system designed to help users query government documents such as policy guidelines, scheme descriptions, and administrative circulars.

The system allows users to upload documents, process them into embeddings, and ask questions that are answered using information retrieved from those documents.

This project demonstrates a complete RAG pipeline implemented in Node.js.

---

## Features

* Upload PDF or text documents
* Extract document text automatically
* Split documents into smaller chunks
* Generate embeddings for semantic search
* Store embeddings locally in a vector file
* Retrieve relevant document sections
* Generate answers using an LLM
* Simple web interface using EJS

---

## System Architecture

User
↓
Frontend (EJS)
↓
Express Backend
↓
Document Processing Pipeline
↓
Chunking + Embedding Generation
↓
Vector Storage (JSON)
↓
Retriever (Cosine Similarity)
↓
LLM Answer Generation

---

## Project Structure

```
project-root
│
├── scripts/
│   └── processDocument.js
│
├── services/
│   ├── embeddingClient.js
│   ├── concurrency.js
│   └── retry.js
│
├── utils/
│   └── chunkText.js
│
├── views/
│   ├── upload.ejs
│   └── query.ejs
│
├── uploads/
│
├── vectors.json
├── server.js
└── package.json
```

---

## Installation

Clone the repository:

```
git clone https://github.com/subbul150/Document_Knowledge_Assistent.git
cd Document_Knowledge_Assistent
```

Install dependencies:

```
npm install
```

---

## Environment Variables

Create a `.env` file:

```
API_KEY=your_api_key_here
```

---

## Running the Project

Start the server:

```
node server.js
```

Open the browser:

```
http://localhost:3000
```

---

## Workflow

1. Upload a PDF or text document
2. The document text is extracted
3. The text is split into chunks
4. Embeddings are generated for each chunk
5. Embeddings are stored in `vectors.json`
6. User asks a question
7. Relevant chunks are retrieved
8. The LLM generates an answer based on retrieved context

---

## Example Queries

* What is the eligibility for PM Kisan scheme?
* What documents are required for PMAY housing scheme?
* What is the refund policy mentioned in the document?

---

## Technologies Used

* Node.js
* Express.js
* EJS
* pdf-parse
* Embedding API
* Cosine similarity retrieval

---

## Limitations

* Uses JSON instead of a vector database
* Limited document size for ingestion
* No authentication or user management
* Not optimized for large-scale deployments

---

## Future Improvements

* Use a vector database (pgvector / Qdrant)
* Add document metadata filtering
* Improve chunking strategy
* Deploy using Docker and cloud infrastructure

---

## Author
Subash Reddy Balupunuri 
Mini project built as part of the AI Backend Engineering learning path.
