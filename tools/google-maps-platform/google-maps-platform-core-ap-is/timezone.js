/**
 * Function to get the time zone information for a specific location and timestamp using the Google Maps Time Zone API.
 *
 * @param {Object} args - Arguments for the time zone request.
 * @param {string} args.location - A comma-separated latitude,longitude tuple representing the location to look up.
 * @param {number} args.timestamp - The desired time as seconds since midnight, January 1, 1970 UTC.
 * @returns {Promise<Object>} - The result of the time zone request.
 */
const executeFunction = async ({ location, timestamp }) => {
  const baseUrl = 'https://www.googleapis.com';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/maps/api/timezone/json`);
    url.searchParams.append('location', location);
    url.searchParams.append('timestamp', timestamp.toString());
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
    console.error('Error fetching time zone information:', error);
    return {
      error: `An error occurred while fetching time zone information: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for fetching time zone information from the Google Maps Time Zone API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_time_zone',
      description: 'Get the time zone information for a specific location and timestamp.',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'A comma-separated latitude,longitude tuple representing the location to look up.'
          },
          timestamp: {
            type: 'number',
            description: 'The desired time as seconds since midnight, January 1, 1970 UTC.'
          }
        },
        required: ['location', 'timestamp']
      }
    }
  }
};

export { apiTool };