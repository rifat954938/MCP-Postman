/**
 * Function to get current weather conditions based on latitude and longitude.
 *
 * @param {Object} args - Arguments for the weather lookup.
 * @param {number} args.latitude - The latitude for the location where weather is being requested.
 * @param {number} args.longitude - The longitude for the location where weather is being requested.
 * @param {string} [args.unitsSystem='METRIC'] - The units system to use for the returned weather conditions. Defaults to METRIC.
 * @param {string} [args.languageCode='en'] - The language for the response. Defaults to English.
 * @returns {Promise<Object>} - The result of the current weather conditions lookup.
 */
const executeFunction = async ({ latitude, longitude, unitsSystem = 'METRIC', languageCode = 'en' }) => {
  const baseUrl = 'https://weather.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/currentConditions:lookup`);
    url.searchParams.append('location.latitude', latitude);
    url.searchParams.append('location.longitude', longitude);
    url.searchParams.append('unitsSystem', unitsSystem);
    url.searchParams.append('languageCode', languageCode);

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(`${url.toString()}&key=${apiKey}`, {
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
    console.error('Error fetching current weather conditions:', error);
    return {
      error: `An error occurred while fetching current weather conditions: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for fetching current weather conditions.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'current_conditions',
      description: 'Get current weather conditions based on latitude and longitude.',
      parameters: {
        type: 'object',
        properties: {
          latitude: {
            type: 'number',
            description: 'The latitude for the location where weather is being requested.'
          },
          longitude: {
            type: 'number',
            description: 'The longitude for the location where weather is being requested.'
          },
          unitsSystem: {
            type: 'string',
            enum: ['METRIC', 'IMPERIAL'],
            description: 'The units system to use for the returned weather conditions.'
          },
          languageCode: {
            type: 'string',
            description: 'The language for the response.'
          }
        },
        required: ['latitude', 'longitude']
      }
    }
  }
};

export { apiTool };