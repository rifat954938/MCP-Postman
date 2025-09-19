/**
 * Function to perform a text search using the Google Places API.
 *
 * @param {Object} args - Arguments for the text search.
 * @param {string} args.query - (Required) The text string on which to search, for example: "restaurant" or "123 Main Street".
 * @param {string} [args.location] - The point around which to retrieve place information, specified as `latitude,longitude`.
 * @param {string} [args.maxprice] - Restricts results to only those places within the specified maximum price range (0 to 4).
 * @param {string} [args.minprice] - Restricts results to only those places within the specified minimum price range (0 to 4).
 * @param {boolean} [args.opennow] - Returns only those places that are open for business at the time the query is sent.
 * @param {string} [args.pagetoken] - Returns up to 20 results from a previously run search.
 * @param {number} [args.radius] - Defines the distance (in meters) within which to return place results.
 * @param {string} [args.type] - Restricts the results to places matching the specified type.
 * @param {string} [args.language] - The language in which to return results.
 * @param {string} [args.region] - The region code, specified as a two-character value.
 * @returns {Promise<Object>} - The result of the text search.
 */
const executeFunction = async ({ query, location, maxprice, minprice, opennow, pagetoken, radius, type, language = 'en', region = 'en' }) => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;

  try {
    // Construct the URL with query parameters
    const url = new URL(baseUrl);
    const params = new URLSearchParams();
    params.append('query', query);
    if (location) params.append('location', location);
    if (maxprice) params.append('maxprice', maxprice);
    if (minprice) params.append('minprice', minprice);
    if (opennow) params.append('opennow', opennow);
    if (pagetoken) params.append('pagetoken', pagetoken);
    if (radius) params.append('radius', radius);
    if (type) params.append('type', type);
    if (language) params.append('language', language);
    if (region) params.append('region', region);
    params.append('key', apiKey);

    // Perform the fetch request
    const response = await fetch(`${url}?${params.toString()}`, {
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
    console.error('Error performing text search:', error);
    return {
      error: `An error occurred while performing the text search: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for performing a text search using the Google Places API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'text_search',
      description: 'Perform a text search using the Google Places API.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '(Required) The text string on which to search.'
          },
          location: {
            type: 'string',
            description: 'The point around which to retrieve place information, specified as `latitude,longitude`.'
          },
          maxprice: {
            type: 'string',
            description: 'Restricts results to only those places within the specified maximum price range (0 to 4).'
          },
          minprice: {
            type: 'string',
            description: 'Restricts results to only those places within the specified minimum price range (0 to 4).'
          },
          opennow: {
            type: 'boolean',
            description: 'Returns only those places that are open for business at the time the query is sent.'
          },
          pagetoken: {
            type: 'string',
            description: 'Returns up to 20 results from a previously run search.'
          },
          radius: {
            type: 'number',
            description: 'Defines the distance (in meters) within which to return place results.'
          },
          type: {
            type: 'string',
            description: 'Restricts the results to places matching the specified type.'
          },
          language: {
            type: 'string',
            description: 'The language in which to return results.'
          },
          region: {
            type: 'string',
            description: 'The region code, specified as a two-character value.'
          }
        },
        required: ['query']
      }
    }
  }
};

export { apiTool };