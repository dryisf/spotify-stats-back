export interface Artist {
  id: string;
  images: object[];
  name: string;
  genres: string[];
}

export interface ArtistsPayload {
  items: Artist[];
  total: number;
  limit: number;
  offset: number;
}

export interface Track {
  album: {
    album_type: string;
    artists: object[];
    images: object[];
  };
  id: string;
  name: string;
}

export interface TracksPayload {
  items: Track[];
  total: number;
  limit: number;
  offset: number;
}
