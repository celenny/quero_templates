import express from "express";
import cors from "cors";
import { auth, templates, files, users } from "@/routes/index";
import type { Express } from "express";

const app: Express = express();
const port = 3000;

app.use(express.json(), cors());

app.use("/templates", templates);

app.use("/users", users);

app.use("/files", files);

app.use("/auth", auth);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});