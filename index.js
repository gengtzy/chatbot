// proses import dependency ke dalam file index.js
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config"; // Memuat variabel dari .env

// mulai persiapkan project kita

const app = express();
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
// app.use(multer());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { body } = req;
  const { prompt } = body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({
      message: "Prompt harus diisi dan berupa string!",
      data: null,
      success: false,
    });

    return;
  }

  try {
    // 1. Dapatkan model yang ingin digunakan (misal: gemini-1.5-flash)
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. Jalankan generateContent pada objek model, bukan pada 'ai.models'
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      data: text,
      message: "Berhasil ditanggapi oleh Google Gemini!",
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      data: null,
      message: e.message || "Ada masalah di server nih!",
    });
  }
});

app.listen(3000, () => {
  console.log("Tiga Rebu");
});
