import { PixabayAPI } from './js/pixabayApi';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';
import notifications from './js/notifications';
import { createMarkupGalleryCard } from './js/templates';

const searchFormEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

let currentHits = 0;

const pixabayApi = new PixabayAPI();

let lightbox = new SimpleLightbox('.photo-link', {
  captions: true,
  captionDelay: 200,
  captionsData: 'alt',
});

// ========= INFINITESCROLL =============
// const options = {
//   root: null,
//   rootMargin: '100px',
//   threshold: 1.0,
// };

// let callback = (entries, observer) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       observer.unobserve(entry.target);
//       pixabayApi.incrementPage();
//       pixabayApi.fetchPhotosByQuery().then(response => {
//         const { hits, total } = response.data;
//         const markup = createMarkupGalleryCard(hits);
//         galleryListEl.insertAdjacentHTML('beforeend', markup);
//         infiniteScroll();
//         lightbox.refresh();
//       });
//     }
//   });
// };

// let observer = new IntersectionObserver(callback, options);

const onSearchFormSubmit = async event => {
  event.preventDefault();

  pixabayApi.page = 1;
  let searchValue = event.target.elements.searchQuery.value.trim();
  if (!searchValue) {
    return;
  }

  pixabayApi.q = searchValue;

  try {
    const response = await pixabayApi.fetchPhotosByQuery();

    const { hits, total, totalHits } = response.data;

    event.target.reset();
    clearGalleryList();

    if (searchValue === '') {
      return;
    }

    if (hits.length === 0) {
      notifications.notifyFailure();
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    }

    if (total > 40) {
      loadMoreBtnEl.classList.remove('is-hidden');
      notifications.notifySuccess(totalHits);
    }

    if (total <= 40) {
      loadMoreBtnEl.classList.add('is-hidden');
      notifications.notifyInfo(totalHits);
    }

    const markup = createMarkupGalleryCard(hits);
    galleryListEl.innerHTML = markup;

    currentHits = hits.length;
    lightbox.refresh();

    // infiniteScroll();
  } catch (err) {
    console.log(err);
  }
};

const onLoadMoreBtnClick = async event => {
  pixabayApi.page += 1;

  try {
    const response = await pixabayApi.fetchPhotosByQuery();

    const { hits, totalHits } = response.data;

    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createMarkupGalleryCard(hits)
    );

    currentHits += hits.length;

    if (currentHits >= totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
      notifications.notifyInfo();
    }
    lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
};

function clearGalleryList() {
  return (galleryListEl.innerHTML = '');
}

// ========= FUCTION for INFINITESCROLL =============
// function infiniteScroll() {
//   const lastCard = document.querySelector('.photo-card:last-child');
//   if (lastCard) {
//     observer.observe(lastCard);
//   }
// }

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
