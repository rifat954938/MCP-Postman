/**
 * Function to get hourly weather forecast based on location.
 *
 * @param {Object} args - Arguments for the forecast lookup.
 * @param {number} args.latitude - The latitude to get the hourly forecast for the requested location.
 * @param {number} args.longitude - The longitude to get the hourly forecast for the requested location.
 * @param {string} [args.unitsSystem='METRIC'] - The units system to use for the returned weather conditions.
 * @param {number} [args.pageSize=24] - The maximum number of hourly forecast records to return per page.
 * @param {string} [args.pageToken] - A page token received from a previous request.
 * @param {number} [args.days=240] - Limits the amount of total hours to fetch starting from the current hour.
 * @param {string} [args.languageCode='en'] - The language for the response.
 * @returns {Promise<Object>} - The result of the hourly weather forecast lookup.
 */
const executeFunction = async ({ latitude, longitude, unitsSystem = 'METRIC', pageSize = 24, pageToken, days = 240, languageCode = 'en' }) => {
  const baseUrl = 'https://weather.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/forecast/hours:lookup`);
    url.searchParams.append('location.latitude', latitude);
    url.searchParams.append('location.longitude', longitude);
    url.searchParams.append('unitsSystem', unitsSystem);
    url.searchParams.append('pageSize', pageSize.toString());
    if (pageToken) url.searchParams.append('pageToken', pageToken);
    url.searchParams.append('days', days.toString());
    url.searchParams.append('languageCode', languageCode);

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json'
    };

    // If an API key is provided, add it to the query parameters
    if (apiKey) {
      url.searchParams.append('key', apiKey);
    }

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
    console.error('Error fetching hourly weather forecast:', error);
    return {
      error: `An error occurred while fetching the hourly weather forecast: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for fetching hourly weather forecast.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'forecast_hours',
      description: 'Get hourly weather forecast based on location.',
      parameters: {
        type: 'object',
        properties: {
          latitude: {
            type: 'number',
            description: 'The latitude to get the hourly forecast for the requested location.'
          },
          longitude: {
            type: 'number',
            description: 'The longitude to get the hourly forecast for the requested location.'
          },
          unitsSystem: {
            type: 'string',
            enum: ['METRIC', 'IMPERIAL'],
            description: 'The units system to use for the returned weather conditions.'
          },
          pageSize: {
            type: 'integer',
            description: 'The maximum number of hourly forecast records to return per page.'
          },
          pageToken: {
            type: 'string',
            description: 'A page token received from a previous request.'
          },
          days: {
            type: 'integer',
            description: 'Limits the amount of total hours to fetch starting from the current hour.'
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