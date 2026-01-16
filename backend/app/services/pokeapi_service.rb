require 'httparty'

class PokeapiService
  BASE_URL = ENV.fetch('POKEAPI_BASE_URL', 'https://pokeapi.co/api/v2')
  GRAPHQL_URL = ENV.fetch('POKEAPI_GRAPHQL_URL', 'https://beta.pokeapi.co/graphql/v1beta')

  def self.get_pokemons(offset: 0, limit: 20, search: nil, sort_by: nil)
    query = build_graphql_query(offset: offset, limit: limit, search: search, sort_by: sort_by)
    
    response = HTTParty.post(
      GRAPHQL_URL,
      body: { query: query }.to_json,
      headers: { 'Content-Type' => 'application/json' }
    )
    
    if response.success?
      data = JSON.parse(response.body)
      
      if data['errors']
        return { error: data['errors'].first['message'] || 'GraphQL query error' }
      end
      
      pokemons_data = data.dig('data', 'pokemon_v2_pokemon') || []
      
      pokemons = pokemons_data.map do |pokemon|
        id = pokemon['id']
        {
          id: id,
          name: pokemon['name'],
          number: id,
          image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/#{id}.png",
        }
      end
      
      total_count = if search
        pokemons.length < limit ? pokemons.length : (pokemons.length + offset)
      else
        1350
      end
      
      has_more = pokemons.length == limit
      
      {
        count: total_count,
        next: has_more ? "offset=#{offset + limit}&limit=#{limit}" : nil,
        previous: offset > 0 ? "offset=#{[offset - limit, 0].max}&limit=#{limit}" : nil,
        results: pokemons
      }
    else
      { error: 'Failed to fetch pokemons from PokeAPI' }
    end
  rescue => e
    { error: e.message }
  end

  def self.build_graphql_query(offset:, limit:, search:, sort_by:)
    where_clause = ''
    if search && !search.strip.empty?
      search_clean = search.strip
      if search_clean.match?(/^\d+$/)
        where_clause = "where: { id: { _eq: #{search_clean.to_i} } }"
      else
        escaped_search = search_clean.gsub('"', '\\"')
        where_clause = "where: { name: { _ilike: \"%#{escaped_search}%\" } }"
      end
    end
    
    order_clause = case sort_by&.downcase
    when 'name'
      'order_by: { name: asc }'
    when 'number', 'id'
      'order_by: { id: asc }'
    else
      'order_by: { id: asc }'
    end
    
    args = ["limit: #{limit}", "offset: #{offset}"]
    args << where_clause unless where_clause.empty?
    args << order_clause
    
    query = <<~GRAPHQL
      {
        pokemon_v2_pokemon(
          #{args.join(', ')}
        ) {
          id
          name
        }
      }
    GRAPHQL
    
    query
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

  def self.transform_pokemon_detail(data)
    {
      id: data['id'],
      name: data['name'],
      number: data['id'],
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/#{data['id']}.png",
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

