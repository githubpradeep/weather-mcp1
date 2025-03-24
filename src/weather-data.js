// Mock weather data
    export const cities = {
      "new york": { temp: 72, condition: "Partly Cloudy", humidity: 65, country: "USA" },
      "london": { temp: 62, condition: "Rainy", humidity: 80, country: "UK" },
      "tokyo": { temp: 85, condition: "Sunny", humidity: 70, country: "Japan" },
      "sydney": { temp: 70, condition: "Clear", humidity: 55, country: "Australia" },
      "paris": { temp: 68, condition: "Cloudy", humidity: 75, country: "France" },
      "berlin": { temp: 65, condition: "Overcast", humidity: 72, country: "Germany" },
      "rome": { temp: 78, condition: "Sunny", humidity: 60, country: "Italy" },
      "madrid": { temp: 82, condition: "Clear", humidity: 45, country: "Spain" },
      "moscow": { temp: 45, condition: "Snowy", humidity: 85, country: "Russia" },
      "dubai": { temp: 95, condition: "Hot", humidity: 40, country: "UAE" },
      "singapore": { temp: 88, condition: "Thunderstorms", humidity: 90, country: "Singapore" },
      "toronto": { temp: 60, condition: "Partly Cloudy", humidity: 68, country: "Canada" }
    };

    // Search for cities by partial name
    export function searchCities(query) {
      if (!query) return [];
      
      const searchTerm = query.toLowerCase();
      const results = [];
      
      for (const [cityName, data] of Object.entries(cities)) {
        if (cityName.includes(searchTerm)) {
          results.push({
            name: cityName,
            country: data.country
          });
        }
      }
      
      return results;
    }
