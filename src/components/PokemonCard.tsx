import React from 'react';
import { PokemonListItem } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onClick: (pokemon: PokemonListItem) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const notFoundImg = `https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png`;

  const formatPokemonName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatPokemonId = (id: number) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  return (
    <div className="pokemon-card" onClick={() => onClick(pokemon)}>
      <div className="pokemon-id">{formatPokemonId(pokemon.id)}</div>
      <div className="pokemon-image-container">
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="pokemon-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = notFoundImg;
            target.className = "pokemon-image-not-found"
          }}
          loading="lazy"
        />
      </div>
      <div className="pokemon-name">
        {formatPokemonName(pokemon.name)}
      </div>
    </div>
  );
};
