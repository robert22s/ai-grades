import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const fileContent = JSON.stringify(sheetData);
    const prompt = `
      You are an assistant that extracts student names and their grades from raw table data. 
      Convert this data into JSON format like [{"name": "Full Name", "grade": "Grade"}].
      Here is the table data: ${fileContent}
    `;

    const gptResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a table extraction assistant." },
        { role: "user", content: prompt },
      ],
    });

    console.log("Response: ");
    console.log(gptResponse.choices[0].message.content);
    const extractedData = gptResponse.choices[0].message.content.replace(
      /```json|```/g,
      "",
    );
    const jsonData = JSON.parse(extractedData);

    const outputFilePath = "output.json";
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));

    res.json({ message: "Data extracted successfully", data: jsonData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

export default router;
