import { ArtistsPayload, Artist, TracksPayload, Track } from "./types";

export const parseArtists = (data: ArtistsPayload) => {
  const artists = data.items;

  const parsedArtists = artists.map((artist: Artist) => ({
    id: artist.id,
    name: artist.name,
    images: artist.images,
    genres: artist.genres,
  }));

  return {
    artists: parsedArtists,
    limit: data.limit,
    total: data.total,
    offset: data.offset,
  };
};

export const parseTracks = (data: TracksPayload) => {
  const tracks = data.items;

  const parsedTracks = tracks.map((track: Track) => ({
    id: track.id,
    name: track.name,
    images: track.album.images,
    artists: track.album.artists,
    albumType: track.album.album_type,
  }));

  return {
    tracks: parsedTracks,
    limit: data.limit,
    total: data.total,
    offset: data.offset,
  };
};
