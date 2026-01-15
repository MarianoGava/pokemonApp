require 'httparty'

class PokeapiService
  BASE_URL = ENV.fetch('POKEAPI_BASE_URL', 'https://pokeapi.co/api/v2')

  def self.get_pokemons(offset: 0, limit: 20)
    response = HTTParty.get("#{BASE_URL}/pokemon?offset=#{offset}&limit=#{limit}")
    
    if response.success?
      data = JSON.parse(response.body)
      
      # Transform the results to include id, name, and image_url
      pokemons = data['results'].map do |pokemon|
        id = extract_id_from_url(pokemon['url'])
        {
          id: id,
          name: pokemon['name'],
          number: id,
          image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/#{id}.png",
          url: pokemon['url']
        }
      end
      
      {
        count: data['count'],
        next: data['next'],
        previous: data['previous'],
        results: pokemons
      }
    else
      { error: 'Failed to fetch pokemons from PokeAPI' }
    end
  rescue => e
    { error: e.message }
  end

  def self.get_pokemon(id)
    response = HTTParty.get("#{BASE_URL}/pokemon/#{id}")
    
    if response.success?
      data = JSON.parse(response.body)
      transform_pokemon_detail(data)
    else
      { error: 'Pokemon not found' }
    end
  rescue => e
    { error: e.message }
  end

  private

  def self.extract_id_from_url(url)
    url.split('/').reject(&:empty?).last.to_i
  end

  def self.transform_pokemon_detail(data)
    {
      id: data['id'],
      name: data['name'],
      number: data['id'],
      image_url: data.dig('sprites', 'front_default') || data.dig('sprites', 'other', 'official-artwork', 'front_default') || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/#{data['id']}.png",
      height: data['height'],
      weight: data['weight'],
      base_experience: data['base_experience'],
      types: data['types'].map { |t| t['type']['name'] },
      abilities: data['abilities'].map do |a|
        {
          name: a['ability']['name'],
          is_hidden: a['is_hidden'],
          slot: a['slot']
        }
      end,
      moves: data['moves'].map do |m|
        {
          name: m['move']['name'],
          version_group_details: m['version_group_details'].map do |vgd|
            {
              level_learned_at: vgd['level_learned_at'],
              move_learn_method: vgd['move_learn_method']['name'],
              version_group: vgd['version_group']['name']
            }
          end
        }
      end,
      forms: data['forms'].map { |f| { name: f['name'], url: f['url'] } },
      stats: data['stats'].map do |s|
        {
          name: s['stat']['name'],
          base_stat: s['base_stat'],
          effort: s['effort']
        }
      end
    }
  end
end

