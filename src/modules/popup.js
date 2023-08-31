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
    console.log('Received ID:', id);
    const response = await fetch(`https://kitsu.io/api/edge/anime/${id}`);
    console.log('Fetch URL:', `https://kitsu.io/api/edge/anime/${id}`);
    const animeData = await response.json();
    console.log('Anime Data:', animeData);

    const comments = await getComments(id);
    console.log('Comments Data:', comments);

    // Fetch Likes
    const likesData = await getLikes();
    console.log('Likes Data:', likesData);

    if (!Array.isArray(likesData)) {
      throw new Error('Invalid or empty likes data');
    }

    const likedItem = likesData.map((like) => like.item_id);

    // Check if comments is an array
    if (!Array.isArray(comments)) {
      console.error('Invalid comments data');
      return;
    }

    const modalContent = `
      <div>
        <div class="modal__content">
          <img src=${animeData.data.attributes.posterImage.original} alt="cover" />
          <div class="name__likes">
            <h2>${animeData.data.attributes.canonicalTitle}</h2>
            <p>
            Likes: ${likesData.length}
            <button class="like__button" ${likedItem.includes(id) ? 'disabled' : ''}>Like</button>
            </p>
          </div>
          <div class="description">
            <p>${animeData.data.attributes.synopsis}</p>
          </div>
            <h2>Comments (${comments.length})</h2>

            <div class="comments__container">
              ${comments.map((comment) => `<li>${comment.username} (${comment.date}):  ${comment.comment}</li>`).join('')}
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
      </div>
    `;
    modalContainer.innerHTML += 'modalContent';

    // modalContainer.innerHTML += modalContent;

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
      // const date = new Date().toLocaleString();

      if (username && comment) {
        try {
          await postComment(id, username, comment);
          // Refresh the comments section
          const updatedComments = await getComments(id);
          const commentsContainer = document.querySelectorAll('.comments__container ul');
          commentsContainer.innerHTML = updatedComments.map((comment) => `<li>${comment.username} (${comment.date}):  ${comment.comment}</li>`).join('');

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