import express, { Request, Response } from "express";
import qs from "qs";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const clientId = process.env.CLIENT_ID;

router.get("/", ({ query }: Request, res: Response) => {
  if (!query.redirectUri) {
    return res.status(400).send({ message: "The redirect URI is missing !" });
  }

  const scope =
    "user-read-private user-read-email user-top-read user-read-recently-played playlist-modify-public playlist-modify-private";

  return res.status(200).send({
    authorizationUrl: `https://accounts.spotify.com/authorize?${qs.stringify({
      response_type: "code",
      client_id: clientId,
      scope,
      redirect_uri: query.redirectUri,
    })}`,
  });
});

export default router;
