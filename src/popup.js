import './styles/main.scss';

const modalContainer = document.querySelectorAll('.modal__wrapper');

// Function to close modal
const closeModal = () => {
  modalContainer.forEach((container) => {
    container.remove();
  });
};

const popUp = async (id) => {
  try {
    // const url = await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/D2Xr8tRh2hyegwFvMhUF/comments/?item_id=${id}`);
    // const comments = await url.json();
    const response = await fetch(`https://kitsu.io/api/edge/trending/anime/${id}`);
    const animeData = await response.json();

    modalContainer.forEach((modal) => {
      //   Comments counter checker
    //   const ul = document.createElement('ul');
    //   const h2 = document.createElement('h2');
    //   if (comments.length) {
    //     h2.innerHTML = `Comments (${comments.length})`;
    //   } else {
    //     h2.innerHTML = 'Comments (0)';
    //   }
    //   ul.appendChild(h2);

      // Generate modal content HTML based on animeData and comments
      const modalContent = `
      <div>
  <div class="close__btn"><span>&times;</span></div>
  <div class="modal__content">
    <img src=${animeData.data.attributes.posterImage.original} alt="cover" />
<div class="name__likes">
  <h2>${animeData.data.attributes.canonicalTitle}</h2>
  <p>Likes</p>
</div>
<div class="description">
  <p>${animeData.data.attributes.synopsis}</p>
</div>
<div class="form__container">
  <h2>Add a comment</h2>
  <form>
    <input type="text" placeholder="Your name..." />
    <textarea type="text" placeholder="Add your comment"></textarea>
    <button type="submit">Submit</button>
  </form>
</div>
  </div>
</div>
        `;

      // Replace the content of the modal container with the new modal content
      modal.innerHTML = modalContent;

      // Attach close button event listener
      const closeBtns = modalContainer.querySelectorAll('.close__btn');
      closeBtns.forEach((btn) => {
        btn.addEventListener('click', closeModal);
      });
    });
  } catch (error) {
    console.error('Error in popUp:', error);
  }
};

export default popUp;