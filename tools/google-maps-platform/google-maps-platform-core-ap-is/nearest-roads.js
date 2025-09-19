/**
 * Function to find the nearest roads for a given set of GPS coordinates using the Google Maps Roads API.
 *
 * @param {Object} args - Arguments for the nearest roads request.
 * @param {string} args.points - The path to be snapped, formatted as latitude/longitude pairs separated by commas and pipe characters. 
 * @returns {Promise<Object>} - The result of the nearest roads request.
 */
const executeFunction = async ({ points }) => {
  const baseUrl = 'https://roads.googleapis.com/v1/nearestRoads';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(baseUrl);
    url.searchParams.append('points', points);
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
    console.error('Error finding nearest roads:', error);
    return {
      error: `An error occurred while finding nearest roads: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for finding nearest roads using the Google Maps Roads API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'nearest_roads',
      description: 'Find the nearest roads for a given set of GPS coordinates.',
      parameters: {
        type: 'object',
        properties: {
          points: {
            type: 'string',
            description: 'The path to be snapped, formatted as latitude/longitude pairs separated by commas and pipe characters.'
          }
        },
        required: ['points']
      }
    }
  }
};

export { apiTool };