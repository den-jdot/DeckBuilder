export default function TrunkFilter({ 
  nameFilter, setNameFilter, 
  humanReadableCardTypeFilter, setHumanReadableCardTypeFilter,
  frameTypeFilter, setFrameTypeFilter,
  attributeFilter, setAttributeFilter,
  levelFilter, setLevelFilter,
  atkFilter, setAtkFilter,
  defFilter, setDefFilter,
  descFilter, setDescFilter,
  raceFilter, setRaceFilter,
  subTypeFilter, setSubTypeFilter,
  spellFilter, setSpellFilter,
  trapFilter, setTrapFilter,
  sortConfig, setSortConfig,
  scaleFilter, setScaleFilter,
  banFilter, setBanFilter
}) {
  return (
    <div className="trunk-filter">
      <div className="double-trunk-filter-grid">
        <div>
          <div className="section-label">Card Name
          </div>
          <input
            type="text"
            placeholder="Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className={nameFilter ? "active-input" : ""}
          />
        </div>

        <div>
          <div className="section-label">Effect
          </div>
          <input
            type="text"
            placeholder="Effect text"
            value={descFilter}
            onChange={(e) => setDescFilter(e.target.value)}
            className={descFilter ? "active-input" : ""}
          />
        </div>
      </div>

      <div className="section-label">Monster
      </div>
      <div className="single-trunk-filter-grid">
          <div className="card-type-buttons">
            {["Normal", "Effect", "Ritual", "Fusion", "Synchro", "Xyz", "Pendulum", "Link"].map((tag) => (
              <button
                key={tag}
                className={frameTypeFilter.includes(tag) ? "active" : ""}
                onClick={() =>
                  setFrameTypeFilter((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>
      </div>

      <div className="triple-trunk-filter-grid">

        <select
          value={raceFilter}
          className={raceFilter ? "active-select" : ""}
          onChange={(e) => setRaceFilter(e.target.value)}
        >
          <option value="">Monster Type</option>
          <option value="Aqua">Aqua</option>
          <option value="Beast">Beast</option>
          <option value="Beast-Warrior">Beast-Warrior</option>
          <option value="Creator-God">Creator-God</option>
          <option value="Cyberse">Cyberse</option>
          <option value="Dinosaur">Dinosaur</option>
          <option value="Divine-Beast">Divine-Beast</option>
          <option value="Dragon">Dragon</option>
          <option value="Fairy">Fairy</option>
          <option value="Fiend">Fiend</option>
          <option value="Fish">Fish</option>
          <option value="Illusion">Illusion</option>
          <option value="Insect">Insect</option>
          <option value="Machine">Machine</option>
          <option value="Plant">Plant</option>
          <option value="Psychic">Psychic</option>
          <option value="Pyro">Pyro</option>
          <option value="Reptile">Reptile</option>
          <option value="Rock">Rock</option>
          <option value="Sea Serpent">Sea Serpent</option>
          <option value="Spellcaster">Spellcaster</option>
          <option value="Thunder">Thunder</option>
          <option value="Warrior">Warrior</option>
          <option value="Winged Beast">Winged Beast</option>
          <option value="Wyrm">Wyrm</option>
          <option value="Zombie">Zombie</option>
        </select>

        <select
          value={subTypeFilter}
          className={subTypeFilter ? "active-select" : ""}
          onChange={(e) => setSubTypeFilter(e.target.value)}
        >
          <option value="">Sub Type</option>
          <option value="Flip">Flip</option>
          <option value="Gemini">Gemini</option>
          <option value="Spirit">Spirit</option>
          <option value="Tuner">Tuner</option>
          <option value="Union">Union</option>
        </select>

        <select
          value={attributeFilter}
          className={attributeFilter ? "active-select" : ""}
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
      </div>    

      <div className="quadra-trunk-filter-grid">  
        <div className="level-filter">
          <div className="section-label">LVL
          </div>
          <input
            type="number"
            placeholder="LVL min"
            value={levelFilter.min}
            onChange={(e) =>
              setLevelFilter({ ...levelFilter, min: parseInt(e.target.value) || "" })
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
          <div className="section-label">ATK
          </div>
          <input
            type="number"
            placeholder="ATK min"
            value={atkFilter.min}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setAtkFilter({ ...atkFilter, min: isNaN(value) ? "" : value });
            }}
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
          <div className="section-label">DEF
          </div>
          <input
            type="number"
            placeholder="DEF min"
            value={defFilter.min}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setDefFilter({ ...defFilter, min: isNaN(value) ? "" : value });
            }}
          />
          <input
            type="number"
            placeholder="DEF max"
            value={defFilter.max}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setDefFilter({ ...defFilter, max: isNaN(value) ? 10000 : value });
            }}
          />
        </div>

        <div className="scale-filter">
          <div className="section-label">Scale
          </div>
          <input
            type="number"
            placeholder="scale min"
            value={scaleFilter.min}
            onChange={(e) =>
              setScaleFilter({ ...scaleFilter, min: parseInt(e.target.value) || "" })
            }
          />
          <input
            type="number"
            placeholder="scale max"
            value={scaleFilter.max}
            onChange={(e) =>
              setScaleFilter({ ...scaleFilter, max: parseInt(e.target.value) || 13 })
            }
          />
        </div>
      </div>

      <div className="triple-trunk-filter-grid">
        <div>
          <div className="section-label">Spell
          </div>
          
          <div className="single-trunk-filter-grid card-type-buttons">
            {["Spell"].map((tag) => (
              <button
                key={tag}
                className={frameTypeFilter.includes(tag) ? "active" : ""}
                onClick={() =>
                  setFrameTypeFilter((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
              >
                {tag}
              </button>
              
            ))}
          </div>

          <div className="single-trunk-filter-grid card-type-buttons">
            {["Quick-Play", "Equip", "Continuous", "Field"].map((tag) => (
              <button
                key={tag}
                className={spellFilter.includes(tag) ? "active" : ""}
                onClick={() =>
                  setSpellFilter((prev) =>
                  ( prev === tag ? "" : tag )
                  )
                }
              >
                {tag}
              </button>
              
            ))}
          </div>

        </div>
        <div>
          <div className="section-label">Trap
          </div>
          <div className="single-trunk-filter-grid card-type-buttons">
            {["Trap"].map((tag) => (
              <button
                key={tag}
                className={frameTypeFilter.includes(tag) ? "active" : ""}
                onClick={() =>
                  setFrameTypeFilter((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="single-trunk-filter-grid card-type-buttons">
            {["Continuous", "Counter"].map((tag) => (
              <button
                key={tag}
                className={trapFilter.includes(tag) ? "active" : ""}
                onClick={() =>
                  setTrapFilter((prev) =>
                    ( prev === tag ? "" : tag )
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>          
        </div>
      
        <div>
          <div>
            <div className="section-label">Banlist</div>
            <div className="single-trunk-filter-grid card-type-buttons">
              {["0", "1", "2"].map((tag) => (
                <button
                  key={tag}
                  className={banFilter.includes(tag) ? "active" : ""}
                  onClick={() =>
                    setBanFilter((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag) // remove if already active
                        : [...prev, tag]               // add if not active
                    )
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="section-label">Sort
          </div>
          <div className="single-trunk-filter-grid sort-controls">
            {[
              { field: "name", label: "Name" },
              { field: "level", label: "Level" },
              { field: "atk", label: "ATK" },
              { field: "def", label: "DEF" },
              { field: "frameType", label: "Frame" },
            ].map(({ field, label }) => {
              const rule = sortConfig.find((r) => r.field === field);
              const direction = rule?.direction;

              return (
                <button
                  key={field}
                  className={direction ? "active" : ""}
                  onClick={(e) => {
                    // Left click (main button)
                    e.preventDefault();
                    setSortConfig((prev) => {
                      const existing = prev.find((r) => r.field === field);

                      if (!existing) {
                        return [...prev, { field, direction: "asc" }];
                      }

                      // Remove this field from sortConfig
                      return prev.filter((r) => r.field !== field);
                    });
                  }}
                  onContextMenu={(e) => {
                    // Right click (secondary button)
                    e.preventDefault();
                    setSortConfig((prev) => {
                      const existing = prev.find((r) => r.field === field);
                      if (!existing) return prev;

                      const newDirection = existing.direction === "asc" ? "desc" : "asc";
                      return prev.map((r) =>
                        r.field === field ? { ...r, direction: newDirection } : r
                      );
                    });
                  }}
                  title="Left click: toggle sort. Right click: change direction"
                >
                  {label}
                  {direction === "asc" ? " ↑" : direction === "desc" ? " ↓" : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
      
    
  );
}
