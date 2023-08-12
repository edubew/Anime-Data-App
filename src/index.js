/* eslint-disable no-tabs */
import './styles/main.scss';
import logo from './assets/logo.png';

const icon = document.querySelector('#icon');
icon.src = logo;

const links = document.querySelector('.nav__links');
// const inputField = document.querySelector('#search__input');
// const cardsContainer = document.querySelector('.cards__container');

const getAnimeGenre = async () => {
  try {
    const data = await fetch('https://api.jikan.moe/v4/genres/anime');
    const result = await data.json();

    let html = '';
    result.data.forEach((genre) => {
      html += `
            <ul>
              <li><a href=${genre.url} target="_blank">${genre.name}</a></li>
            </ul>
          `;
    });
    links.innerHTML = html;
  } catch (error) {
    console.error('Error fetching anime genres:', error);
  }
};

async function fetchAnime() {
  try {
    const response = await fetch('https://kitsu.io/api/edge/trending/anime');
    const result = await response.json();
    console.log(result);

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
              <p class="desc">The highest grossing Anime film of all time is Demon Slayer: Mugen Train (aka Demon Slayer: Kimetsu no Yaiba). The film grossed over $500 million at the worldwide box office and was the highest-grossing film of 2020.</p>
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

function trimDescription(description, maxWords) {
  const words = description.split(' ');
  if (words.length > maxWords) {
    return `${words.slice(0, maxWords).join(' ')}...`;
  }
  return description;
}

// Event listener
window.addEventListener('load', () => {
  getAnimeGenre(); // Load anime genres (if needed)
  fetchAnime(); // Load anime data
});
