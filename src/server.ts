import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 7000;

import AuthRouter from "./routes/auth.routes";
import fileRouter from "./routes/files.router";

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter)
app.use('/files', fileRouter)

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

