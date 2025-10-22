import React, { useState, useEffect } from 'react';
import { RefreshCw, Navigation } from 'lucide-react';
import map_logo from '../../assets/map_logo.png'

const CityGraphPathfinder = () => {
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [shortestPath, setShortestPath] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [shortestPathData, setShortestPathData] = useState({});
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
    };

    handleResize(); // check on mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // City data with positions and connections
  const cities = {
    'City A': { x: 10, y: 30, connections: ['City B', 'City C', 'City D', 'City E'] },
    'City B': { x: 8, y: 70, connections: ['City A', 'City F'] },
    'City C': { x: 22, y: 55, connections: ['City A', 'City E', 'City F'] },
    'City D': { x: 22, y: 20, connections: ['City A', 'City G'] },
    'City E': { x: 35, y: 45, connections: ['City A', 'City C', 'City F', 'City G', 'City H', 'City I', 'City J'] },
    'City F': { x: 40, y: 63, connections: ['City B', 'City C', 'City E'] },
    'City G': { x: 40, y: 10, connections: ['City D', 'City E', 'City J', 'City K', 'City N'] },
    'City H': { x: 50, y: 54, connections: ['City E', 'City I', 'City J', 'City L', 'City M'] },
    'City I': { x: 55, y: 85, connections: ['City E', 'City H', 'City P'] },
    'City J': { x: 55, y: 27, connections: ['City E', 'City G', 'City H', 'City M', 'City N'] },
    'City K': { x: 52, y: 0, connections: ['City G'] },
    'City L': { x: 65, y: 70, connections: ['City H', 'City M'] },
    'City M': { x: 70, y: 41, connections: ['City H', 'City J', 'City L', 'City N', 'City O', 'City P'] },
    'City N': { x: 77, y: 8, connections: ['City G', 'City J', 'City M', 'City O', 'City Q'] },
    'City O': { x: 85, y: 30, connections: ['City M', 'City N', 'City P', 'City Q'] },
    'City P': { x: 87, y: 67, connections: ['City I', 'City M', 'City O'] },
    'City Q': { x: 95, y: 19, connections: ['City N', 'City O'] }
  };

  // Generate edges between connected cities
  const generateEdges = () => {
    const edges = [];
    const processed = new Set();

    Object.entries(cities).forEach(([cityName, cityData]) => {
      cityData.connections.forEach(connectedCity => {
        const edgeKey = [cityName, connectedCity].sort().join('-');
        if (!processed.has(edgeKey)) {
          const fromPos = cities[cityName];
          const toPos = cities[connectedCity];
          edges.push({
            id: edgeKey,
            from: { name: cityName, ...fromPos },
            to: { name: connectedCity, ...toPos }
          });
          processed.add(edgeKey);
        }
      });
    });

    return edges;
  };

  const edges = generateEdges();

  // Simple pathfinding using BFS
  const findShortestPath = async (from, to) => {
    try {
      const response = await fetch(`http://localhost:8080/${from}-${to}`);
      const data = await response.json();
      // console.log('Fetched data:', data);
      
      setShortestPathData(data);
      // console.log('Setting shortestPathData to:', data);
      // console.log('Setting shortestPath to:', data["cities"]);

      return data["cities"]
    } catch (error) {
      console.error('Error fetching shortest path:', error);
    }
  };
  

  const handleCityClick = async (cityName) => {
    if (!fromCity) {
      setFromCity(cityName);
      setToCity(null);
      setShortestPath(null);
    } else if (!toCity && cityName !== fromCity) {
      setToCity(cityName);
      const path = await findShortestPath(fromCity, cityName);//-------------------------------------
      setShortestPath(path);
      // console.log("yes");
      
      // console.log(shortestPath);
      
    } else {
      // Reset selection
      setFromCity(cityName);
      setToCity(null);
      setShortestPath(null);
    }
  };

  const handleRefresh = () => {
    setFromCity(null);
    setToCity(null);
    setShortestPath(null);
    setHoveredCity(null);
  };

  const getCityStyle = (cityName) => {
    let baseClasses = "absolute w-10 h-10 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-base cursor-pointer transition-all duration-300 transform select-none z-10";
    
    if (hoveredCity === cityName) {
      baseClasses += " scale-110 shadow-2xl";
    }
    
    if (fromCity === cityName) {
      baseClasses += " bg-green-500 shadow-green-400 shadow-2xl ring-4 ring-green-300";
    } else if (toCity === cityName) {
      baseClasses += " bg-red-500 shadow-red-400 shadow-2xl ring-4 ring-red-300";
    } else if (shortestPath && shortestPath.includes(cityName)) {
      //console.log("Emtered");
      
      baseClasses += " bg-yellow-500 shadow-yellow-400 shadow-lg ring-2 ring-yellow-300";
    } else {
      baseClasses += " bg-blue-500 hover:shadow-blue-500 hover:shadow-xl";
    }
    
    return baseClasses;
  };

  const getEdgeStyle = (edge) => {
    const isInPath = shortestPath && 
      shortestPath.includes(edge.from.name) && 
      shortestPath.includes(edge.to.name) &&
      Math.abs(shortestPath.indexOf(edge.from.name) - shortestPath.indexOf(edge.to.name)) === 1;
    
    return isInPath ? 'stroke-yellow-400 stroke-[8px]' : 'stroke-blue-300 stroke-[1px]';
  };

  if (isSmallScreen) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-indigo-500">
        <h2 className="text-red-900 text-2xl font-bold text-center px-4">
          🚫 Screen too small! <br /> Please use a device like Tab or Desktop.
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl text-purple-600 font-extrabold mb-4 flex items-center gap-2 px-8">
          <Navigation className="w-6 h-6 sm:w-8 sm:h-8" />
          OptiPath
          <span className='text-black text-sm pt-3'>(Dijkstra Algorithm)</span>
      </h1>
      <div className="flex justify-between top-4 left-4 right-4 z-20 mx-7">
        <div className="bg-white rounded-2xl w-1/3 shadow-lg p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <img src={map_logo} alt="mapLogo" className="h-20"/>
            <div className="flex-1">
              <div className="text-sm md:text-base text-gray-600 space-y-1">
                <div className="font-extrabold">
                  <span className="text-xl m-1">From :</span> 
                  <span className="font-semibold text-green-600">{fromCity || 'Select starting city'}</span>
                </div>
                <hr/>
                <div className="font-extrabold">
                  <span className="text-xl m-1">To :</span>  
                  <span className="font-semibold text-red-600">{toCity || 'Select destination city'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={handleRefresh}
            className="flex font-extrabold items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 999 }} // Temporary test
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
      

      {/* Graph Container */}
      <div className="absolute inset-0 pt-32 pb-8">
        <div className="relative w-full h-full max-w-6xl mx-auto px-4">
          {/* SVG for edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {edges.map((edge) => (
              <line
                key={edge.id}
                x1={`${edge.from.x}%`}
                y1={`${edge.from.y}%`}
                x2={`${edge.to.x}%`}
                y2={`${edge.to.y}%`}
                className={getEdgeStyle(edge)}
                strokeDasharray={shortestPath && 
                  shortestPath.includes(edge.from.name) && 
                  shortestPath.includes(edge.to.name) &&
                  Math.abs(shortestPath.indexOf(edge.from.name) - shortestPath.indexOf(edge.to.name)) === 1 
                  ? "5,5" : "none"}
              />
            ))}
          </svg>

          {/* Cities */}
          {Object.entries(cities).map(([cityName, position]) => (
            <div
              key={cityName}
              className={getCityStyle(cityName)}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleCityClick(cityName)}
              onMouseEnter={() => setHoveredCity(cityName)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <span className="text-center leading-tight">
                {cityName.split(' ').map((word, i) => (
                  <div key={i} className="leading-none">{word}</div>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 shadow-lg w-full">
        {shortestPath && (
          <div 
            className="mt-4 p-3 bg-blue-100 border border-orange-500 rounded-2xl"
            style={{ boxShadow: '0px 0px 25px 4px rgba(59,130,246,0.5)' }}>
            <div className="text-sm md:text-base">
              <span className="font-extrabold text-yellow-800 text-xl">
                Shortest path from {fromCity} to {toCity} = 
              </span>
              <span className="font-semibold ml-2 text-xl">
                <span className= "text-violet-800">{shortestPath.join(' → ')}</span> 
                <span className= "text-green-600"> &nbsp;&nbsp;( {shortestPathData.distance} KM )</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {/* <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-20">
        <div className="text-sm text-gray-600 space-y-1">
          <div><span className="font-semibold">Instructions:</span></div>
          <div>• Hover over cities to see shadow effects</div>
          <div>• Click a city to select as starting point (green)</div>
          <div>• Click another city to find the shortest path (red destination, yellow path)</div>
          <div>• Use refresh button to reset selections</div>
        </div>
      </div> */}
    </div>
  );
};

export default CityGraphPathfinder;