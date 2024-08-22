import express, { Express, Request, Response } from "express";
import axios from "axios";
import qs from "qs";
import { DateTime } from "luxon";
import dotenv from "dotenv";

import { parseArtists } from "./parsers";

dotenv.config();

const app: Express = express();

const port = process.env.PORT;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.use(express.json());

app.use(function (req: Request, res: Response, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  next();
});

app.get("/login", ({ query }: Request, res: Response) => {
  if (!query.redirectUri) {
    return res.status(400).send({ message: "The redirect URI is missing !" });
  }

  const scope = "user-read-private user-read-email user-top-read";

  return res.status(200).send({
    authorizationUrl: `https://accounts.spotify.com/authorize?${qs.stringify({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: query.redirectUri,
      state: "ffhdjgkieudosple",
    })}`,
  });
});

app.get("/token", async ({ query }: Request, res: Response) => {
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

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    )}`,
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

app.get("/refreshToken", async (req: Request, res: Response) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).send({ message: "The refresh token is missing !" });
  }

  const params = {
    refresh_token: token,
    grant_type: "refresh_token",
  };

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    )}`,
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

app.get("/artists", async (req: Request, res: Response) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).send({ message: "The access token is missing !" });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const { data } = await axios({
    method: "get",
    url: "https://api.spotify.com/v1/me/top/artists",
    headers,
  });

  if (!data) {
    return res
      .status(400)
      .send({ message: "Error while fetching the top artists" });
  }

  return res.status(200).send(parseArtists(data));
});

app.listen(port, () => console.log(`it's alive on http://localhost:${port}`));
