/**
 * Function to find a place from text using the Google Maps Places API.
 *
 * @param {Object} args - Arguments for the find place request.
 * @param {string} args.input - The text string on which to search (e.g., "restaurant" or "123 Main Street").
 * @param {string} args.inputtype - The type of input, either "textquery" or "phonenumber".
 * @param {string} [args.fields] - A comma-separated list of place data types to return.
 * @param {string} [args.locationbias] - Prefer results in a specified area.
 * @param {string} [args.language="en"] - The language in which to return results.
 * @returns {Promise<Object>} - The result of the find place request.
 */
const executeFunction = async ({ input, inputtype, fields, locationbias, language = 'en' }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/maps/api/place/findplacefromtext/json`);
    url.searchParams.append('input', input);
    url.searchParams.append('inputtype', inputtype);
    if (fields) url.searchParams.append('fields', fields);
    if (locationbias) url.searchParams.append('locationbias', locationbias);
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
    console.error('Error finding place from text:', error);
    return {
      error: `An error occurred while finding place from text: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for finding a place from text using the Google Maps Places API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'find_place_from_text',
      description: 'Find a place from text using the Google Maps Places API.',
      parameters: {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            description: 'The text string on which to search.'
          },
          inputtype: {
            type: 'string',
            enum: ['textquery', 'phonenumber'],
            description: 'The type of input.'
          },
          fields: {
            type: 'string',
            description: 'A comma-separated list of place data types to return.'
          },
          locationbias: {
            type: 'string',
            description: 'Prefer results in a specified area.'
          },
          language: {
            type: 'string',
            description: 'The language in which to return results.'
          }
        },
        required: ['input', 'inputtype']
      }
    }
  }
};

export { apiTool };