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
export const getLikes = async (id) => {
  try {
    const response = await fetch(likesUrl);
    const likesData = await response.json();

    const like = likesData.find((like) => like.item_id === id);

    if (like) {
      return like.likes || [];
    }
    // If no matching item is found, return an appropriate default value
    return [];
  } catch (error) {
    console.error('Error fetching likes:', error);
    return [];
  }
};