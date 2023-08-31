/* eslint-disable no-tabs */
import '../styles/main.scss';
import logo from '../assets/logo.jpg';
import { popUp } from './popup.js';

const icon = document.querySelector('#icon');
icon.src = logo;

async function fetchAnime() {
  try {
    const response = await fetch('https://kitsu.io/api/edge/trending/anime');
    const result = await response.json();

    let show = '';
    if (result.data) {
      result.data.forEach((anime) => {
        if (anime.attributes && anime.attributes.posterImage) {
          const imageUrl = anime.attributes.posterImage.original;
          const animeId = anime.id;
          show += `
            <article class="card__container" data-id="${animeId}">
              <div class="cover__container">
              <img src="${imageUrl}" alt="${anime.attributes.canonicalTitle}" />
              <h2>${anime.attributes.canonicalTitle}</h2>
              </div>
              <div class="card__details">
                <h3>${anime.attributes.canonicalTitle}</h3>
                <h2>TV-MA • TV Series • 30min</h2>
                <h3>Rating: ${anime.attributes.ageRatingGuide}</h3>
                <div class="rating">
					        <i class="fas fa-star"></i>
					        <i class="fas fa-star"></i>
					        <i class="fas fa-star"></i>
					        <i class="fas fa-star"></i>
					        <i class="far fa-star"></i>
					        <span>4.4/5</span>
				        </div>
                <div class="tags">
				         <span class="tag">Action</span>
				         <span class="tag">Drama</span>
				         <span class="tag">Fantasy</span>
			          </div>
              <h2 class="fact">Fun Fact:</h2>
              <p class="desc">Spirited Away was both the first anime to be nominated for an Oscar and the first one to win it.</p>
              <button type="submit" class="btn popup-link">View Description</button>
            </div>
            </article>
          `;
        }
      });

      // Populate the cards container with the show content
      const cardsContainer = document.querySelector('#cardsContainer');
      cardsContainer.innerHTML = show;

      // Add click event listeners to the popup links after the buttons are generated
      // const popupLinks = document.querySelectorAll('.popup-link');
      // popupLinks.forEach((popupLink) => {
      //   popupLink.addEventListener('click', handlePopupLinkClick);
      // });
    } else {
      show = '<p>No data available.</p>';
    }
  } catch (error) {
    console.error('Error fetching anime:', error);
  }
}

// Function to handle the click on "View Description" button
const modal = document.querySelector('#popup-window');
document.addEventListener('click', async (e) => {
  const popupLink = e.target.closest('.popup-link');
  if (popupLink) {
    const cardContainer = popupLink.closest('.card__container');
    if (cardContainer) {
      modal.style.display = 'block';
      const animeId = cardContainer.getAttribute('data-id');
      popUp(animeId);
      // popUp();
    }
  }
});

// Event listener
window.addEventListener('load', () => {
  fetchAnime();
});

export { fetchAnime };