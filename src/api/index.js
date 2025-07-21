export async function fetchDestinations(page = 1, size = 10) {
  try {
    const response = await fetch(`/api/destinations?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error('Failed to fetch destinations: ' + response.status);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchDestinationById(id) {
  try {
    const response = await fetch(`/api/destinations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch destination: ' + response.status);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
