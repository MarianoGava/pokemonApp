interface Stat {
  name: string;
  base_stat: number;
}

interface BaseStatsProps {
  stats: Stat[];
  primaryColorHex: string;
}

const getStatAbbreviation = (statName: string): string => {
  const statMap: Record<string, string> = {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SATK',
    'special-defense': 'SDEF',
    'speed': 'SPD',
  };
  return statMap[statName.toLowerCase()] || statName.toUpperCase();
};

export default function BaseStats({ stats, primaryColorHex }: BaseStatsProps) {
  return (
    <section>
      <h3 className="text-subtitle1 mb-4 text-center" style={{ color: primaryColorHex }}>Base Stats</h3>
      <div className="flex gap-4">
        <div className="flex flex-col">
          {stats.map((stat) => (
            <span 
              key={stat.name}
              className="text-body2 font-bold uppercase text-right h-4 flex items-center justify-end" 
              style={{ color: primaryColorHex }}
            >
              {getStatAbbreviation(stat.name)}
            </span>
          ))}
        </div>
        <div className="bg-gray-300 w-px" />
        <div className="flex-1 flex flex-col">
          {stats.map((stat) => (
            <div key={stat.name} className="flex items-center gap-4 h-4">
              <span className="text-[10px] h-4 flex items-center">
                {String(stat.base_stat).padStart(3, '0')}
              </span>
              <div className="flex-1 rounded-full h-1 relative" style={{ backgroundColor: primaryColorHex }}>
                <div className="absolute inset-0 rounded-full bg-white opacity-70"></div>
                <div
                  className="h-1 rounded-full relative z-10"
                  style={{ 
                    width: `${(stat.base_stat / 255) * 100}%`,
                    backgroundColor: primaryColorHex
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
