/**
 * Function to perform a nearby search for places using the Google Maps Places API.
 *
 * @param {Object} args - Arguments for the nearby search.
 * @param {string} args.location - The point around which to retrieve place information, specified as `latitude,longitude`.
 * @param {string} [args.keyword] - The text string on which to search, such as a place name or category.
 * @param {string} [args.name] - Equivalent to `keyword`, combined with values in the `keyword` field.
 * @param {number} [args.radius] - Defines the distance (in meters) within which to return place results.
 * @param {string} [args.type] - Restricts the results to places matching the specified type.
 * @param {string} [args.language="en"] - The language in which to return results.
 * @returns {Promise<Object>} - The result of the nearby search.
 */
const executeFunction = async ({ location, keyword, name, radius, type, language = 'en' }) => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(baseUrl);
    url.searchParams.append('location', location);
    if (keyword) url.searchParams.append('keyword', keyword);
    if (name) url.searchParams.append('name', name);
    if (radius) url.searchParams.append('radius', radius);
    if (type) url.searchParams.append('type', type);
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
    console.error('Error performing nearby search:', error);
    return {
      error: `An error occurred while performing nearby search: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for performing a nearby search using the Google Maps Places API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'nearby_search',
      description: 'Search for places within a specified area using the Google Maps Places API.',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The point around which to retrieve place information, specified as `latitude,longitude`.'
          },
          keyword: {
            type: 'string',
            description: 'The text string on which to search, such as a place name or category.'
          },
          name: {
            type: 'string',
            description: 'Equivalent to `keyword`, combined with values in the `keyword` field.'
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
          }
        },
        required: ['location']
      }
    }
  }
};

export { apiTool };