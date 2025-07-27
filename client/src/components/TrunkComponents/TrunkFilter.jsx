export default function TrunkFilter({ 
  nameFilter, setNameFilter, 
  typeLineFilter, setTypeLineFilter,
  attributeFilter, setAttributeFilter,
  levelFilter, setLevelFilter,
  atkFilter, setAtkFilter,
  defFilter, setDefFilter,
  descFilter, setDescFilter,
  cardTypeFilter, setCardTypeFilter
}) {
  return (
    <div className="trunk-filter">
      <div className="double-trunk-filter-grid">
        <input
          type="text"
          placeholder="Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <input
          type="text"
          placeholder="Effect text"
          value={descFilter}
          onChange={(e) => setDescFilter(e.target.value)}
        />

        <select
          value={attributeFilter}
          onChange={(e) => setAttributeFilter(e.target.value)}
        >
          <option value="">Attr</option>
          <option value="DARK">DARK</option>
          <option value="LIGHT">LIGHT</option>
          <option value="FIRE">FIRE</option>
          <option value="WATER">WATER</option>
          <option value="EARTH">EARTH</option>
          <option value="WIND">WIND</option>
          <option value="DIVINE">DIVINE</option>
        </select>

        <select
          value={cardTypeFilter}
          onChange={(e) => setCardTypeFilter(e.target.value)}
        >
          <option value="">Card Type</option>
          <option value="Monster">Monster</option>
          <option value="Spell">Spell</option>
          <option value="Trap">Trap</option>
        </select>
      </div>

      <div className="triple-trunk-filter-grid">
        
        <div className="level-filter">
          <div className="section-label">LVL</div>
          <input
            type="number"
            placeholder="LVL min"
            value={levelFilter.min}
            onChange={(e) =>
              setLevelFilter({ ...levelFilter, min: parseInt(e.target.value) || 0 })
            }
          />
          <input
            type="number"
            placeholder="LVL max"
            value={levelFilter.max}
            onChange={(e) =>
              setLevelFilter({ ...levelFilter, max: parseInt(e.target.value) || 13 })
            }
          />
        </div>

        <div className="atk-filter">
          <div className="section-label">ATK</div>
          <input
            type="number"
            placeholder="ATK min"
            value={atkFilter.min}
            onChange={(e) =>
              setAtkFilter({ ...atkFilter, min: parseInt(e.target.value) || 0 })
            }
          />
          <input
            type="number"
            placeholder="ATK max"
            value={atkFilter.max}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setAtkFilter({ ...atkFilter, max: isNaN(value) ? 10000 : value });
            }}
          />
        </div>

        <div className="def-filter">
          <div className="section-label">DEF</div>
          <input
            type="number"
            placeholder="DEF min"
            value={defFilter.min}
            onChange={(e) =>
              setDefFilter({ ...defFilter, min: parseInt(e.target.value) || 0 })
            }
          />
          <input
            type="number"
            placeholder="DEF max"
            value={defFilter.max}
            onChange={(e) =>
              setDefFilter({ ...defFilter, max: parseInt(e.target.value) || 10000 })
            }
          />
        </div>
      </div>
      
    </div>
  );
}
