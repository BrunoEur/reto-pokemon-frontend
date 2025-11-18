import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
   onCleanCache: () => void;
  placeholder?: string;
 
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
   onCleanCache,
  placeholder = "Buscar Pokémon...",
}) => {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
      />
      {searchTerm && (
        <button
          className="clear-search"
          onClick={() => onSearchChange('')}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
      {!searchTerm && (
        <button
          className="clear-search"
          onClick={() => onCleanCache()}
        >
          clean-cache
        </button>
      )}
    </div>

  );
};
