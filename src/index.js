/* eslint-disable no-tabs */
import './styles/main.scss';
import logo from './assets/logo.png';

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
          show += `
            <article class="card__container" data-id="${anime.id}">
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
              <p class="desc">The highest grossing Anime film of all time is Demon Slayer: Mugen Train. The film grossed over $500 million at the worldwide box office and was the highest-grossing film of 2020.</p>
              <button type="submit" class="btn">View Description</button>
              </div>
            </article>
          `;
        }
      });
    } else {
      show = '<p>No data available.</p>';
    }
    const cardsContainer = document.querySelector('#cardsContainer');
    cardsContainer.innerHTML = show;
  } catch (error) {
    console.error('Error fetching anime:', error);
  }
}

// Event listener
window.addEventListener('load', () => {
  fetchAnime(); // Load anime data
});
