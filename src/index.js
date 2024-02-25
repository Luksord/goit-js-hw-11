import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const photoCard = document.querySelector('.photo-card');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('[data-search]');
const loadMoreBtn = document.querySelector('.load-more');

const apiKey = '42459296-f3a6b1338d11ae21b8ba0dee6';
let searchQuery = '';
let pageCount = 1;
const perPage = 40;

loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  clearPhotoCard();
  searchQuery = searchInput.value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.info(`There is no valid query in the imput.`);
    return; // Nie wykonuj wyszukiwania dla pustego zapytania
  }
  searchQuery = searchQuery.split(' ').join('+');
  try {
    pageCount = 1;
    const { images, totalHits, totalPages } = await fetchPhotos(
      searchQuery,
      pageCount
    );
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    renderPhotos({ images, totalHits });
    loadMoreBtn.style.display = 'block';
  } catch (error) {
    console.log(error);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  pageCount++;
  try {
    const { images, totalHits, totalPages } = await fetchPhotos(
      searchQuery,
      pageCount
    );
    renderPhotos({ images, totalHits });
  } catch (error) {
    console.error(error);
  }
});

async function fetchPhotos(searchTerm, page) {
  /* 
  const searchParams = new URLSearchParams({
    key: apiKey,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: pageCount,
    per_page: perPage,
  });
  console.log(searchParams);
  const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);
  console.log(response.data);
  */
  const response = await axios.get(
    `https://pixabay.com/api/?key=${apiKey}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );
  console.log(response.data);
  const images = response.data.hits;
  const totalHits = response.data.totalHits;
  const totalPages = Math.ceil(totalHits / perPage);
  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    throw new Error('No results found');
  }
  if (page > totalPages) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtn.style.display = 'none';
    throw new Error('No more results');
  }
  return { images, totalHits, totalPages };
}

function renderPhotos(data) {
  const images = data.images;
  const markup = images
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
    <div class="photo-card-template">
      <a href="${largeImageURL}" data-lightbox="gallery">
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
  lightbox.refresh();
  loadMoreBtn.style.display = 'block';
  smoothScroll(cardHeight * 2);
}

/*
const searchParams = new URLSearchParams({
    key: apiKey,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: pageCount,
    per_page: perPage,
  });
  console.log(searchParams);
  const response = await fetch(`https://pixabay.com/api/?${searchParams}`).then((response) => response.json()).then((data) => console.log(data)).then({hits}) => {
  const markupArray = hits.flatMap(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => 
    `<div class="photo-card">
        <a href="${largeImageURL}" data-lightbox="gallery">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b><br>${likes}</p>
          <p class="info-item"><b>Views</b><br>${views}</p>
          <p class="info-item"><b>Comments</b><br>${comments}</p>
          <p class="info-item"><b>Downloads</b><br>${downloads}</p>
        </div>
      </div>`
  );
  return markupArray;
}
markupArray => {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = markupArray.join('');
};
*/

const lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
lightbox.on('show.simplelightbox', function () {
  lightbox.load();
});

async function smoothScroll(scrollAmount) {
  await new Promise(resolve => {
    window.scrollBy({
      top: scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(resolve, 1000); // Opóźnienie wykonania kolejnej akcji
  });
}

async function clearPhotoCard() {
  photoCard.innerHTML = '';
}

/*


import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '42459296-f3a6b1338d11ae21b8ba0dee6';
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('[data-search]');
const photoCard = document.querySelector('.photo-card');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let pageCount = 1;
const perPage = 40;

const hideLoadMoreBtn = () => {
  loadMoreBtn.style.display = 'none';
};

const showLoadMoreBtn = () => {
  loadMoreBtn.style.display = 'block';
};

hideLoadMoreBtn();

const fetchImage = async () => {
  const searchParams = {
    key: apiKey,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: pageCount,
    per_page: perPage,
  });
  console.log(searchParams);
  const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);
  console.log(response.data);
  const totalHits = response.data.totalHits;
  const totalPages = Math.ceil(totalHits / perPage);
  const hits = response.data.hits;
  
if (totalHits !== 0) {
  Notiflix.Notify.success('Hooray! We found ${totalHits} images.');
}
if (totalHits === 0) {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
if (pageCount > totalPages) {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}
return { hits, totalHits, totalPages };
};

function renderImages(data) {
const hits = data.hits;
const markup = hits
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
      <a href="${largeImageURL}" data-lightbox="gallery">
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
lightbox.refresh();
showLoadMoreBtn();
smoothScroll(cardHeight * 2);
}

const lightbox = new SimpleLightbox('.photo-card a', {
captionsData: 'alt',
captionPosition: 'bottom',
captionDelay: 250,
});

lightbox.on('show.simplelightbox', function () {
lightbox.load();
});

searchForm.addEventListener('submit', async event => {
event.preventDefault();
gallery.innerHTML = '';
searchQuery = searchInput.value.trim();
if (searchQuery === '') {
  Notiflix.Notify.info(`There is no valid query in the imput.`);
  return; // Nie wykonuj wyszukiwania dla pustego zapytania
}
searchQuery = searchInput.split(' ').join('+');
try {
  pageCount = 1;
  const { hits, totalHits, totalPages } = await fetchImage(
    searchQuery,
    pageCount
  );
  renderImages({ hits, totalHits });
} catch (error) {
  console.log(error.message);
}
});

loadMoreBtn.addEventListener('click', async () => {
currentPage++;
try {
  const { photos, totalHits, totalPages } = await fetchPhotos(
    queryString,
    currentPage
  );
  renderPhotos({ photos, totalHits });
} catch (error) {
  console.error(error);
}
});

*/
