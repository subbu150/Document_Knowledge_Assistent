import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
// const {GoogleGenerativeAI} =require("@google/generative-ai");
// const dotenv=require("dotenv")

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateEmbedding(text) {

  const model = genAI.getGenerativeModel({
    model: 'gemini-embedding-001'
  });

  const result = await model.embedContent(text);

  return result.embedding.values;
}