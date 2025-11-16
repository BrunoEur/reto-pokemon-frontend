export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  base_experience: number;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
}

export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
}

export interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}
