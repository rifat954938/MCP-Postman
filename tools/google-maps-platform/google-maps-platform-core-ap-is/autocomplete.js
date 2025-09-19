/**
 * Function to perform Place Autocomplete search using Google Maps API.
 *
 * @param {Object} args - Arguments for the autocomplete search.
 * @param {string} args.input - The text string on which to search (required).
 * @param {string} [args.sessiontoken] - A random string which identifies an autocomplete session.
 * @param {string} [args.components] - A grouping of places to restrict results by country.
 * @param {boolean} [args.strictbounds] - Returns only places strictly within the defined region.
 * @param {number} [args.offset] - The position of the last character used for matching predictions.
 * @param {string} [args.origin] - The origin point for calculating distance to the destination.
 * @param {string} [args.location] - The point around which to retrieve place information.
 * @param {number} [args.radius] - The distance within which to return place results.
 * @param {string} [args.types] - Restrict results to certain types of places.
 * @param {string} [args.language] - The language in which to return results.
 * @param {string} [args.region] - The region code for filtering results.
 * @returns {Promise<Object>} - The result of the autocomplete search.
 */
const executeFunction = async ({
  input,
  sessiontoken,
  components,
  strictbounds,
  offset,
  origin,
  location,
  radius,
  types,
  language = 'en',
  region = 'en'
}) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/maps/api/place/autocomplete/json`);
    url.searchParams.append('input', input);
    if (sessiontoken) url.searchParams.append('sessiontoken', sessiontoken);
    if (components) url.searchParams.append('components', components);
    if (strictbounds) url.searchParams.append('strictbounds', strictbounds);
    if (offset) url.searchParams.append('offset', offset);
    if (origin) url.searchParams.append('origin', origin);
    if (location) url.searchParams.append('location', location);
    if (radius) url.searchParams.append('radius', radius);
    if (types) url.searchParams.append('types', types);
    if (language) url.searchParams.append('language', language);
    if (region) url.searchParams.append('region', region);
    url.searchParams.append('key', apiKey);

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error performing autocomplete search:', error);
    return {
      error: `An error occurred while performing autocomplete search: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for performing Place Autocomplete search using Google Maps API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'autocomplete_place',
      description: 'Perform Place Autocomplete search using Google Maps API.',
      parameters: {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            description: 'The text string on which to search.'
          },
          sessiontoken: {
            type: 'string',
            description: 'A random string which identifies an autocomplete session.'
          },
          components: {
            type: 'string',
            description: 'A grouping of places to restrict results by country.'
          },
          strictbounds: {
            type: 'boolean',
            description: 'Returns only places strictly within the defined region.'
          },
          offset: {
            type: 'integer',
            description: 'The position of the last character used for matching predictions.'
          },
          origin: {
            type: 'string',
            description: 'The origin point for calculating distance to the destination.'
          },
          location: {
            type: 'string',
            description: 'The point around which to retrieve place information.'
          },
          radius: {
            type: 'integer',
            description: 'The distance within which to return place results.'
          },
          types: {
            type: 'string',
            description: 'Restrict results to certain types of places.'
          },
          language: {
            type: 'string',
            description: 'The language in which to return results.'
          },
          region: {
            type: 'string',
            description: 'The region code for filtering results.'
          }
        },
        required: ['input']
      }
    }
  }
};

export { apiTool };