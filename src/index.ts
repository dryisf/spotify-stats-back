import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { artists, login, token, tracks } from "./routes";

dotenv.config();

const app: Express = express();

const port = process.env.PORT;

app.use(express.json());

app.use(function (req: Request, res: Response, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONT_URL || "");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  next();
});

app.use("/login", login);

app.use("/token", token);

app.use("/artists", artists);

app.use("/tracks", tracks);

app.listen(port, () => console.log(`it's alive on http://localhost:${port}`));
