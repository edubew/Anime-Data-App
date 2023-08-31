const likesUrl = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/D2Xr8tRh2hyegwFvMhUF/likes';

export const createLike = async (id) => {
  const likes = await fetch(likesUrl, {
    method: 'Post',
    body: JSON.stringify({
      item_id: id,
    }),
    headers: {
      'Content-type': 'application/json;  charset=UTF-8',
    },
  }).then((res) => res.status);
  return likes;
};

// Get likes from the API
export const getLikes = async () => {
  try {
    const response = await fetch(likesUrl);
    const likesData = await response.json();
    return likesData.likes || [];
  } catch (error) {
    console.error('Error fetching likes:', error);
    return []; // Return an empty array or appropriate default value
  }
};