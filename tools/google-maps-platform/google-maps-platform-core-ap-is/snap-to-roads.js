/**
 * Function to snap GPS coordinates to the nearest roads using Google Maps Roads API.
 *
 * @param {Object} args - Arguments for the snap to roads function.
 * @param {string} args.path - The path to be snapped, consisting of latitude/longitude pairs separated by commas and pipe characters.
 * @param {boolean} [args.interpolate=false] - Whether to interpolate a path to include all points forming the full road geometry.
 * @returns {Promise<Object>} - The result of the snap to roads request.
 */
const executeFunction = async ({ path, interpolate = false }) => {
  const baseUrl = 'https://roads.googleapis.com/v1/snaptoroads';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;

  try {
    // Construct the URL with query parameters
    const url = new URL(baseUrl);
    url.searchParams.append('path', path);
    url.searchParams.append('interpolate', interpolate.toString());
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
    console.error('Error snapping to roads:', error);
    return {
      error: `An error occurred while snapping to roads: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for snapping GPS coordinates to roads using Google Maps Roads API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'snap_to_roads',
      description: 'Snap GPS coordinates to the nearest roads.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path to be snapped, consisting of latitude/longitude pairs.'
          },
          interpolate: {
            type: 'boolean',
            description: 'Whether to interpolate a path to include all points forming the full road geometry.'
          }
        },
        required: ['path']
      }
    }
  }
};

export { apiTool };