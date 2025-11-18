import { usePokemon } from './hooks/usePokemon';
import { SearchBar } from './components/SearchBar';
import { PokemonCard } from './components/PokemonCard';
import { Pagination } from './components/Pagination';
import { PokemonDetail } from './components/PokemonDetail';
import './App.css';

function App() {
  const {
    pokemonList,
    selectedPokemon,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    goToPage,
    selectPokemon,
    clearSelection,
    useCleanCache
  } = usePokemon();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokédex for Hortifrut</h1>
        <p>Descubre el mundo de los Pokémon</p>
      </header>

      <main className="app-main">
        <div className="search-section">
          <SearchBar
            onCleanCache={useCleanCache}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar Pokémon por nombre..."
          />
        </div>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Cargando Pokémon...</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="pokemon-grid">
              {pokemonList.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={selectPokemon}
                />
              ))}
            </div>

            {!searchTerm && (
              <Pagination
                pagination={pagination}
                onPageChange={goToPage}
                loading={loading}
              />
            )}
          </>
        )}

        {!loading && !error && pokemonList.length === 0 && searchTerm && (
          <div className="no-results">
            <p>🔍 No se encontraron Pokémon con el nombre "{searchTerm}"</p>
            <button onClick={() => setSearchTerm('')}>
              Ver todos los Pokémon
            </button>
          </div>
        )}
      </main>

      <PokemonDetail pokemon={selectedPokemon} onClose={clearSelection} />

      <footer className="app-footer">
        <p>Pokédex creada for BJ</p>
      </footer>
    </div>
  );
}

export default App;
