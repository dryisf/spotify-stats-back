import express, { Request, Response } from "express";
import axios from "axios";

import { parseArtists } from "../parsers";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
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

export default router;
