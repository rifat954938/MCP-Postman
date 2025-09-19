/**
 * Function to calculate travel distance and time using the Google Maps Distance Matrix API.
 *
 * @param {Object} args - Arguments for the distance matrix request.
 * @param {string} args.origins - The starting point(s) for calculating travel distance and time.
 * @param {string} args.destinations - The finishing point(s) for calculating travel distance and time.
 * @param {string} [args.mode='driving'] - The transportation mode to use (e.g., driving, walking, bicycling, transit).
 * @param {string} [args.units='metric'] - The unit system to use when displaying results.
 * @param {string} [args.language='en'] - The language in which to return results.
 * @param {number} [args.departure_time] - Desired time of departure in seconds since midnight, January 1, 1970 UTC.
 * @param {string} [args.avoid] - Restrictions to avoid (e.g., tolls, highways).
 * @param {string} [args.traffic_model='best_guess'] - Assumptions to use when calculating time in traffic.
 * @returns {Promise<Object>} - The result of the distance matrix request.
 */
const executeFunction = async ({ origins, destinations, mode = 'driving', units = 'metric', language = 'en', departure_time, avoid, traffic_model = 'best_guess' }) => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;

  try {
    // Construct the URL with query parameters
    const url = new URL(baseUrl);
    url.searchParams.append('origins', origins);
    url.searchParams.append('destinations', destinations);
    url.searchParams.append('mode', mode);
    url.searchParams.append('units', units);
    url.searchParams.append('language', language);
    if (departure_time) url.searchParams.append('departure_time', departure_time);
    if (avoid) url.searchParams.append('avoid', avoid);
    if (traffic_model) url.searchParams.append('traffic_model', traffic_model);
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
    console.error('Error fetching distance matrix:', error);
    return {
      error: `An error occurred while fetching the distance matrix: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for calculating travel distance and time using the Google Maps Distance Matrix API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'distance_matrix',
      description: 'Calculate travel distance and time using the Google Maps Distance Matrix API.',
      parameters: {
        type: 'object',
        properties: {
          origins: {
            type: 'string',
            description: 'The starting point(s) for calculating travel distance and time.'
          },
          destinations: {
            type: 'string',
            description: 'The finishing point(s) for calculating travel distance and time.'
          },
          mode: {
            type: 'string',
            enum: ['driving', 'walking', 'bicycling', 'transit'],
            description: 'The transportation mode to use.'
          },
          units: {
            type: 'string',
            description: 'The unit system to use when displaying results.'
          },
          language: {
            type: 'string',
            description: 'The language in which to return results.'
          },
          departure_time: {
            type: 'integer',
            description: 'Desired time of departure in seconds since midnight, January 1, 1970 UTC.'
          },
          avoid: {
            type: 'string',
            description: 'Restrictions to avoid (e.g., tolls, highways).'
          },
          traffic_model: {
            type: 'string',
            description: 'Assumptions to use when calculating time in traffic.'
          }
        },
        required: ['origins', 'destinations']
      }
    }
  }
};

export { apiTool };