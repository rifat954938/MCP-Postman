/**
 * Function to get the daily weather forecast based on location.
 *
 * @param {Object} args - Arguments for the forecast request.
 * @param {number} args.latitude - The latitude to get the daily forecast for the requested location.
 * @param {number} args.longitude - The longitude to get the daily forecast for the requested location.
 * @param {number} [args.pageSize=5] - The maximum number of daily forecast records to return per page (1 to 10).
 * @param {string} [args.pageToken] - A page token received from a previous request to retrieve the subsequent page.
 * @param {number} [args.days=10] - Limits the amount of total days to fetch starting from the current day (1 to 10).
 * @param {string} [args.languageCode='en'] - The language for the response.
 * @returns {Promise<Object>} - The result of the weather forecast request.
 */
const executeFunction = async ({ latitude, longitude, pageSize = 5, pageToken, days = 10, languageCode = 'en' }) => {
  const baseUrl = 'https://weather.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/forecast/days:lookup`);
    url.searchParams.append('location.latitude', latitude);
    url.searchParams.append('location.longitude', longitude);
    url.searchParams.append('pageSize', pageSize.toString());
    if (pageToken) url.searchParams.append('pageToken', pageToken);
    url.searchParams.append('days', days.toString());
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
    console.error('Error fetching weather forecast:', error);
    return {
      error: `An error occurred while fetching the weather forecast: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting the daily weather forecast.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'forecast_days',
      description: 'Get the daily weather forecast based on location.',
      parameters: {
        type: 'object',
        properties: {
          latitude: {
            type: 'number',
            description: 'The latitude to get the daily forecast for the requested location.'
          },
          longitude: {
            type: 'number',
            description: 'The longitude to get the daily forecast for the requested location.'
          },
          pageSize: {
            type: 'integer',
            description: 'The maximum number of daily forecast records to return per page (1 to 10).'
          },
          pageToken: {
            type: 'string',
            description: 'A page token received from a previous request to retrieve the subsequent page.'
          },
          days: {
            type: 'integer',
            description: 'Limits the amount of total days to fetch starting from the current day (1 to 10).'
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