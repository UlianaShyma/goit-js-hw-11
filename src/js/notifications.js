import Notiflix from 'notiflix';

function notifyFailure() {
  return Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again'
  );
}

function notifySuccess(totalHits) {
  return Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function notifyInfo(totalHits) {
  return Notiflix.Notify.info(
    `We're sorry, but you've reached the end of search results. There are only ${totalHits} images`
  );
}

export default {
  notifyFailure,
  notifySuccess,
  notifyInfo,
};
