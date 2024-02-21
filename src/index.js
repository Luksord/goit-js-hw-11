import Notiflix from 'notiflix';
import axios from 'axios';

const apiKey = '42459296-f3a6b1338d11ae21b8ba0dee6';
const searchQuery = document.querySelector('[data-search]');
const photoCard = document.querySelector('.photo-card');
const form = document.querySelector('#search-form');

let page = 1;
const perPage = 20;

const fetchImage = async () => {
  const searchParams = new URLSearchParams({
    key: apiKey,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: perPage,
  });
  console.log(searchParams);
  const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);
  console.log(response.data);
  const totalHits = response.data.totalHits;
  const totalPages = Math.ceil(totalHits / perPage);
  const hits = response.data.hits;
  /*
const hit = {
    webformatURL: response.data.hits.webformatURL,
    largeImageURL: response.data.hits.largeImageURL,
    tags: response.data.hits.tags,
    likes: response.data.hits.likes,
    views: response.data.hits.views,
    comments: response.data.hits.comments,
    downloads: response.data.hits.downloads,
};
*/
  if (totalHits !== 0) {
    Notiflix.Notify.success('Hooray! We found ${totalHits} images.');
  }
  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (page > totalPages) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
};

function renderImages(data) {
  const photos = data.photos;
  const markup = photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b><br>${likes}</p>
          <p class="info-item"><b>Views</b><br>${views}</p>
          <p class="info-item"><b>Comments</b><br>${comments}</p>
          <p class="info-item"><b>Downloads</b><br>${downloads}</p>
        </div>
      </div>
    `
    )
    .join('');
  photoCard.insertAdjacentHTML('beforeend', markup);
}
