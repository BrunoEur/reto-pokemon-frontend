import React from 'react';
import { Pokemon } from '../types/pokemon';

interface PokemonDetailProps {
  pokemon: Pokemon | null;
  onClose: () => void;
}

export const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  const formatPokemonName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatPokemonId = (id: number) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return colors[type] || '#68A090';
  };
  const notFoundImg = `https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png`;
  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default || notFoundImg;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pokemon-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        
        <div className="pokemon-detail-header">
          <h2>{formatPokemonName(pokemon.name)}</h2>
          <span className="pokemon-detail-id">{formatPokemonId(pokemon.id)}</span>
        </div>

        <div className="pokemon-detail-content">
          <div className="pokemon-detail-image">
            <img src={imageUrl} alt={pokemon.name} />
          </div>

          <div className="pokemon-detail-info">
            <div className="pokemon-types">
              {pokemon.types?.map((typeInfo, index) => (
                <span
                  key={index}
                  className="pokemon-type"
                  style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
                >
                  {formatPokemonName(typeInfo.type.name)}
                </span>
              ))}
            </div>

            <div className="pokemon-stats">
              <div className="stat-item">
                <span className="stat-label">Altura:</span>
                <span className="stat-value">{(pokemon.height / 10).toFixed(1)} m</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Peso:</span>
                <span className="stat-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Experiencia base:</span>
                <span className="stat-value">{pokemon.base_experience}</span>
              </div>
            </div>

            <div className="pokemon-abilities">
              <h3>Habilidades</h3>
              <div className="abilities-list">
                {pokemon.abilities?.map((abilityInfo, index) => (
                  <span key={index} className="ability-tag">
                    {formatPokemonName(abilityInfo.ability.name)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
