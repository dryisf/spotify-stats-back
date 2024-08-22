interface SpotifyArtist {
  name: string;
  images: object[];
}

interface SpotifyArtistsPayload {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  previous: number;
}

export const parseArtists = (data: SpotifyArtistsPayload) => {
  const artists = data.items;

  const parsedArtists = artists.map((artist: SpotifyArtist) => ({
    name: artist.name,
    images: artist.images,
  }));

  return {
    artists: parsedArtists,
    limit: data.limit,
    total: data.total,
    offset: data.offset,
    previous: data.previous,
  };
};
