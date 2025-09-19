/**
 * Function to perform query autocomplete using Google Maps API.
 *
 * @param {Object} args - Arguments for the autocomplete query.
 * @param {string} args.input - The text string on which to search (required).
 * @param {number} [args.offset] - The position of the last character used to match predictions.
 * @param {string} [args.location] - The point around which to retrieve place information (latitude,longitude).
 * @param {number} [args.radius] - Defines the distance (in meters) within which to return place results.
 * @param {string} [args.language='en'] - The language in which to return results.
 * @returns {Promise<Object>} - The result of the autocomplete query.
 */
const executeFunction = async ({ input, offset, location, radius, language = 'en' }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/maps/api/place/queryautocomplete/json`);
    url.searchParams.append('input', input);
    if (offset) url.searchParams.append('offset', offset);
    if (location) url.searchParams.append('location', location);
    if (radius) url.searchParams.append('radius', radius);
    url.searchParams.append('language', language);
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
    console.error('Error performing query autocomplete:', error);
    return {
      error: `An error occurred while performing query autocomplete: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for query autocomplete using Google Maps API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'query_autocomplete',
      description: 'Perform query autocomplete using Google Maps API.',
      parameters: {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            description: 'The text string on which to search.'
          },
          offset: {
            type: 'integer',
            description: 'The position of the last character used to match predictions.'
          },
          location: {
            type: 'string',
            description: 'The point around which to retrieve place information (latitude,longitude).'
          },
          radius: {
            type: 'integer',
            description: 'Defines the distance (in meters) within which to return place results.'
          },
          language: {
            type: 'string',
            description: 'The language in which to return results.'
          }
        },
        required: ['input']
      }
    }
  }
};

export { apiTool };