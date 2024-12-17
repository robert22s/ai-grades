import express from "express";
import dotenv from "dotenv";

import uploadRouter from "./routes/upload.js";
import downloadRouter from "./routes/download.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/upload", uploadRouter);
app.use("/download", downloadRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
