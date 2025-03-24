import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
    import { z } from 'zod';
    import { cities, searchCities } from './weather-data.js';

    // Create an MCP server for weather information
    const server = new McpServer({
      name: "Weather Service",
      version: "1.0.0",
      description: "An MCP server providing weather information with city lookup capabilities"
    });

    // Add a weather resource to get weather by city
    server.resource(
      "weather", 
      new ResourceTemplate("weather://{city}", { list: undefined }),
      async (uri, { city }) => {
        const cityLower = city.toLowerCase();
        if (!cities[cityLower]) {
          return {
            contents: [{
              uri: uri.href,
              text: `Weather information for ${city} not found.`
            }]
          };
        }
        
        const data = cities[cityLower];
        return {
          contents: [{
            uri: uri.href,
            text: `Weather in ${city.charAt(0).toUpperCase() + city.slice(1)} (${data.country}):
Temperature: ${data.temp}°F
Condition: ${data.condition}
Humidity: ${data.humidity}%`
          }]
        };
      }
    );
    
    // Add a "get weather" tool
    server.tool(
      "get_weather",
      { city: z.string().describe("Name of the city to get weather for") },
      async ({ city }) => {
        const cityLower = city.toLowerCase();
        if (!cities[cityLower]) {
          return {
            content: [{ 
              type: "text", 
              text: `Weather information for ${city} not found.` 
            }],
            isError: true
          };
        }
        
        const data = cities[cityLower];
        return {
          content: [{ 
            type: "text", 
            text: `Weather in ${city.charAt(0).toUpperCase() + city.slice(1)} (${data.country}):
Temperature: ${data.temp}°F
Condition: ${data.condition}
Humidity: ${data.humidity}%` 
          }]
        };
      },
      { description: "Get current weather information for a specific city" }
    );

    // Add a "search cities" tool
    server.tool(
      "search_cities",
      { 
        query: z.string().describe("Partial name of the city to search for"),
        limit: z.number().optional().default(5).describe("Maximum number of results to return")
      },
      async ({ query, limit }) => {
        const results = searchCities(query);
        
        if (results.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: `No cities found matching "${query}".` 
            }]
          };
        }
        
        const limitedResults = results.slice(0, limit);
        const resultText = limitedResults.map(city => 
          `${city.name.charAt(0).toUpperCase() + city.name.slice(1)} (${city.country})`
        ).join('\n');
        
        return {
          content: [{ 
            type: "text", 
            text: `Cities matching "${query}":\n${resultText}${results.length > limit ? `\n\nShowing ${limit} of ${results.length} results.` : ''}` 
          }]
        };
      },
      { description: "Search for cities by partial name" }
    );

    // Add a "list cities" tool
    server.tool(
      "list_cities",
      { 
        limit: z.number().optional().default(10).describe("Maximum number of cities to list"),
        offset: z.number().optional().default(0).describe("Number of cities to skip")
      },
      async ({ limit, offset }) => {
        const cityList = Object.entries(cities)
          .map(([name, data]) => ({ 
            name: name.charAt(0).toUpperCase() + name.slice(1), 
            country: data.country 
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(offset, offset + limit);
        
        const totalCities = Object.keys(cities).length;
        const cityText = cityList.map(city => `${city.name} (${city.country})`).join('\n');
        
        return {
          content: [{ 
            type: "text", 
            text: `Available cities:\n${cityText}\n\nShowing ${cityList.length} of ${totalCities} cities.` 
          }]
        };
      },
      { description: "List available cities with pagination" }
    );

    export { server };
