/**
 * Function to get place details from the Google Places API.
 *
 * @param {Object} args - Arguments for the place details request.
 * @param {string} args.place_id - The unique identifier for the place.
 * @param {string} [args.fields] - A comma-separated list of place data types to return.
 * @param {string} [args.sessiontoken] - A random string identifying an autocomplete session.
 * @param {string} [args.language='en'] - The language in which to return results.
 * @param {string} [args.region='en'] - The region code for the request.
 * @returns {Promise<Object>} - The result of the place details request.
 */
const executeFunction = async ({ place_id, fields, sessiontoken, language = 'en', region = 'en' }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/maps/api/place/details/json`);
    url.searchParams.append('place_id', place_id);
    if (fields) url.searchParams.append('fields', fields);
    if (sessiontoken) url.searchParams.append('sessiontoken', sessiontoken);
    url.searchParams.append('language', language);
    url.searchParams.append('region', region);
    url.searchParams.append('key', apiKey);

    // Set up headers for the request
    const headers = {
      'Accept': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
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
    console.error('Error fetching place details:', error);
    return {
      error: `An error occurred while fetching place details: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for fetching place details from the Google Places API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_place_details',
      description: 'Fetch details about a specific place from the Google Places API.',
      parameters: {
        type: 'object',
        properties: {
          place_id: {
            type: 'string',
            description: 'The unique identifier for the place.'
          },
          fields: {
            type: 'string',
            description: 'A comma-separated list of place data types to return.'
          },
          sessiontoken: {
            type: 'string',
            description: 'A random string identifying an autocomplete session.'
          },
          language: {
            type: 'string',
            description: 'The language in which to return results.'
          },
          region: {
            type: 'string',
            description: 'The region code for the request.'
          }
        },
        required: ['place_id']
      }
    }
  }
};

export { apiTool };