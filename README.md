# 🚀 Document Knowledge Assistant (RAG System)

## 📌 Overview

The **Document Knowledge Assistant** is a production-style **Retrieval-Augmented Generation (RAG)** system that enables users to interact with documents such as:

* Government policies
* Scheme guidelines
* Administrative documents

Users can upload documents, which are processed asynchronously into embeddings, stored in a vector database, and queried using natural language.

This project demonstrates a **complete AI backend pipeline with job processing, vector search, and LLM integration**.

---

# ✨ Features

### 📄 Document Ingestion

* Upload PDF and text documents
* Automatic text extraction (PDF parsing)
* Chunking with overlap strategy

### ⚡ Async Processing (Production Pattern)

* Background job system
* Job status tracking (PENDING → PROCESSING → COMPLETED)
* Non-blocking API design

### 🧠 RAG Pipeline

* Embedding generation using API
* Vector storage using Qdrant
* Semantic similarity search
* Context-aware answer generation

### 💬 Query System

* Ask questions based on uploaded document
* Context injection into LLM prompt
* Clean formatted answers (Markdown support)

### 🌐 UI

* Simple EJS-based interface
* Upload → Processing → Query flow

---

# 🏗 System Architecture

```
User
↓
Frontend (EJS)
↓
Express Backend
↓
Upload API → Job Created
↓
Job Queue (In-Memory)
↓
Worker Process
↓
Text Extraction (PDF / TXT)
↓
Chunking + Embeddings
↓
Vector DB (Qdrant)
↓
Retriever (Similarity Search + Filtering)
↓
LLM (Groq / OpenAI Compatible)
↓
Answer to User
```

---

# 📁 Project Structure

```
project-root
│
├── routes/
│   ├── upload.js
│   ├── job.js
│   └── query.js
│
├── workers/
│   └── jobWorker.js
│
├── jobs/
│   └── jobStore.js
│
├── scripts/
│   ├── processDocument.js
│   └── query.js
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
│   ├── processing.ejs
│   └── query.ejs
│
├── uploads/
│
├── server.js
└── package.json
```

---

# ⚙️ Installation

```bash
git clone https://github.com/subbul150/Document_Knowledge_Assistent.git
cd Document_Knowledge_Assistent
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file:

```
GROQ_API_KEY=your_api_key
GEMINI_API_KEY=your_embedding_key
```

---

# ▶️ Running the Project

```bash
node server.js
```

Open:

```
http://localhost:3000
```

---

# 🔄 Workflow (End-to-End)

### 1️⃣ Upload Document

* User uploads PDF/TXT
* Job is created

### 2️⃣ Background Processing

* Worker extracts text
* Splits into chunks
* Generates embeddings
* Stores in Qdrant

### 3️⃣ Query Phase

* User asks question
* Query embedding generated
* Relevant chunks retrieved (filtered by document)
* LLM generates answer

---

# 🧠 RAG Pipeline (Core Logic)

```
User Question
↓
Embedding
↓
Vector Search (Top-K)
↓
Filter by documentId
↓
Retrieve chunks
↓
Build context
↓
LLM response
```

---

# 💡 Example Queries

* What is the eligibility for PM Kisan scheme?
* What are the benefits of the policy?
* Explain the Keynesian theory mentioned in the document.

---

# 🛠 Technologies Used

* Node.js
* Express.js
* EJS
* Qdrant (Vector Database)
* pdf-parse
* Groq LLM (OpenAI-compatible API)
* Google Generative AI (Embeddings)

---

# ⚠️ Limitations

* In-memory job queue (not persistent)
* No authentication / user sessions
* Limited scalability (single-node)
* Basic error handling

---

# 🚀 Future Improvements

* Redis + BullMQ for job queue
* Persistent database (PostgreSQL / MongoDB)
* Cloud storage (AWS S3)
* Multi-user session handling
* Advanced retrieval (Hybrid search, reranking)
* Deployment with Docker + Cloud

---

# 🎯 Key Learnings

* Designing RAG systems end-to-end
* Async backend architecture (jobs + workers)
* Vector search & embedding pipelines
* Prompt engineering for answer quality
* Debugging real-world AI failures

---

# 👨‍💻 Author

**Subash Reddy Balupunuri**

Mini project built as part of the **AI Backend Engineering (Project Payan)** learning path.
