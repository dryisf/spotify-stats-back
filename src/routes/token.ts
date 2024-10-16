import axios from "axios";
import express, { Request, Response } from "express";
import { DateTime } from "luxon";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const headers = {
  "content-type": "application/x-www-form-urlencoded",
  Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  )}`,
};

router.get("/", async ({ query }: Request, res: Response) => {
  if (!query.code) {
    return res
      .status(400)
      .send({ message: "The authorization code is missing !" });
  }

  if (!query.redirectUri) {
    return res.status(400).send({ message: "The redirect URI is missing !" });
  }

  const params = {
    code: query.code,
    redirect_uri: query.redirectUri,
    grant_type: "authorization_code",
  };

  const { data } = await axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers,
    params,
  });

  if (!data) {
    return res.status(400).send({ message: "Error while fetching the token" });
  }

  return res.status(200).send({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpirationDate: DateTime.now().plus({
      seconds: data.expires_in,
    }),
  });
});

router.get("/refresh", async (req: Request, res: Response) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).send({ message: "The refresh token is missing !" });
  }

  const params = {
    refresh_token: token,
    grant_type: "refresh_token",
  };

  const { data } = await axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers,
    params,
  });

  if (!data) {
    return res
      .status(400)
      .send({ message: "Error while refreshing the token" });
  }

  return res.status(200).send({
    accessToken: data.access_token,
    accessTokenExpirationDate: DateTime.now().plus({
      seconds: data.expires_in,
    }),
  });
});

export default router;
