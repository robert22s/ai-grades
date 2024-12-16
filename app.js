import express from "express";
import dotenv from "dotenv";

import indexRouter from "./routes/index.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
