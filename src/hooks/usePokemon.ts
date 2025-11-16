import { useState, useEffect, useCallback, useRef } from 'react';
import { Pokemon, PokemonListItem, PaginationInfo } from '../types/pokemon';
import { pokemonService } from '../services/pokemonService';

interface UsePokemonReturn {
  pokemonList: PokemonListItem[];
  selectedPokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  goToPage: (page: number) => void;
  selectPokemon: (pokemon: PokemonListItem) => void;
  clearSelection: () => void;
}

const POKEMON_PER_PAGE = 20;

export const usePokemon = (): UsePokemonReturn => {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: POKEMON_PER_PAGE
  });

  const loadingRef = useRef<{ [key: string]: boolean }>({});

  const fetchPokemonList = useCallback(async (page: number, search: string = '') => {
    const cacheKey = search ? `search:${search}` : `page:${page}`;
    
    if (loadingRef.current[cacheKey]) {
      console.log(`Request  for cache clave : ${cacheKey}`);
      return;
    }

    loadingRef.current[cacheKey] = true;
    setLoading(true);
    setError(null);
    
    try {
      if (search.trim()) {
        const results = await pokemonService.getPokemonByName(search);
        setPokemonList([{
          id: results.id,
          name: results.name,
          url: `https://challenge.solimain.com/api/v1/pokemon/${results.id}`
        }]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCount: 1,
          limit: POKEMON_PER_PAGE
        });
      } else {
        const offset = (page - 1) * POKEMON_PER_PAGE;
        const response = await pokemonService.getPokemonList(POKEMON_PER_PAGE, offset);
        
        setPokemonList(response.results);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(response.count / POKEMON_PER_PAGE),
          totalCount: response.count,
          limit: POKEMON_PER_PAGE
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setPokemonList([]);
    } finally {
      setLoading(false);
      delete loadingRef.current[cacheKey];
    }
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchPokemonList(page, searchTerm);
    }
  }, [fetchPokemonList, pagination.totalPages, searchTerm]);

  const selectPokemon = useCallback(async (pokemon: PokemonListItem) => {
    const cacheKey = `detail:${pokemon.id}`;
    
    if (loadingRef.current[cacheKey]) {
      console.log(`Request already in progress for Pokemon: ${pokemon.id}`);
      return;
    }

    loadingRef.current[cacheKey] = true;
    setLoading(true);
    setError(null);
    
    try {
      const detailedPokemon = await pokemonService.getPokemonById(pokemon.id);
      setSelectedPokemon(detailedPokemon);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los detalles del Pokémon');
    } finally {
      setLoading(false);
      delete loadingRef.current[cacheKey];
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setSelectedPokemon(null);
  }, []);

  useEffect(() => {
    fetchPokemonList(1);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchPokemonList(1, searchTerm);
      } else {
        fetchPokemonList(pagination.currentPage);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return {
    pokemonList,
    selectedPokemon,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm: handleSearchChange,
    goToPage,
    selectPokemon,
    clearSelection
  };
};
