interface Artist {
  id: string;
  images: object[];
  name: string;
}

interface ArtistsPayload {
  items: Artist[];
  total: number;
  limit: number;
  offset: number;
}

interface Track {
  album: {
    album_type: string;
    artists: object[];
    images: object[];
  };
  id: string;
  name: string;
}

interface TracksPayload {
  items: Track[];
  total: number;
  limit: number;
  offset: number;
}

export const parseArtists = (data: ArtistsPayload) => {
  const artists = data.items;

  const parsedArtists = artists.map((artist: Artist) => ({
    id: artist.id,
    name: artist.name,
    images: artist.images,
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
