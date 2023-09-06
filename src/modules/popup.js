import { createLike, getLikes } from './likes.js';
import { postComment, getComments } from './postComments.js';

const modalContainer = document.getElementById('popup-window');
const closeBtn = document.querySelector('#close-btn');

// Function to close the modal
closeBtn.addEventListener('click', () => {
  modalContainer.style.display = 'none';
});

const popUp = async (id) => {
  try {
    const response = await fetch(`https://kitsu.io/api/edge/anime/${id}`);
    const animeData = await response.json();

    const comments = await getComments(id);
    const likesData = await getLikes();

    const likedItem = likesData.map((like) => like.item_id);

    const modalContent = `
      <div>
        <div class="modal__content">
          <div class="synopsis__container">
            <img src=${animeData.data.attributes.posterImage.original} alt="cover" />
            <div>
              <div class="name__likes">
                <h2>${animeData.data.attributes.canonicalTitle}</h2>
                <p>
                  <i class="fa-solid fa-heart like__button ${likedItem.includes(id) ? 'disabled' : ''}"> </i>
                  ${likesData.length}
                </p>
              </div>
              <div class="description">
                <p>${animeData.data.attributes.synopsis}</p>
              </div>
            </div>
          </div>
          <h2 class="comments__title">Comments (${comments.length})</h2>
          <div class="comments__container">
          <ul>
          ${
  Array.isArray(comments)
    ? comments.length === 0
      ? '<li>No comments yet. Be the first to comment!</li>'
      : comments.map((comment) => `<li>${comment.username}: ${comment.comment}</li>`).join('')
    : '<li>Please add a comment!!</li>'
}
        </ul>
          </div>
        <div class="form__container" id="${animeData.id}">
          <h2>Add a comment</h2>
          <form class="comment__form">
            <input type="text" id="username" placeholder="Your name..." />
            <textarea id="commentText" placeholder="Add your comment"></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    `;

    modalContainer.innerHTML = modalContent;

    // Add likes functionality
    const likeBtn = document.querySelector('.like__button');
    likeBtn.addEventListener('click', async () => {
      if (!likedItem.includes(id)) {
        try {
          await createLike(id);
          likeBtn.disabled = true;
          likeBtn.innerText = 'Liked';
          likesData.push({ item_id: id });
          document.querySelector('.name__likes p').innerText = `Likes: ${likesData.length}`;
        } catch (error) {
          console.error('Error liking item:', error);
        }
      }
    });

    // Post user comments to the API
    const commentForm = document.querySelector('.comment__form');
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameInput = commentForm.querySelector('#username');
      const commentTextInput = commentForm.querySelector('#commentText');

      const username = usernameInput.value;
      const comment = commentTextInput.value;

      if (username && comment) {
        try {
          await postComment(id, username, comment);
          // Refresh the comments section
          const updatedComments = await getComments(id);
          const commentsList = document.querySelector('.comments__container ul');
          commentsList.innerHTML = updatedComments.map((comment) => `<li>${comment.username}: ${comment.comment}</li>`).join('');

          // Clear input fields
          usernameInput.value = '';
          commentTextInput.value = '';
        } catch (error) {
          console.error('Error posting comment:', error);
        }
      }
    });
  } catch (error) {
    console.error('Error in popUp:', error);
  }
};

export { popUp };
