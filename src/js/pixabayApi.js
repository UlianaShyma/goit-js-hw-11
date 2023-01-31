import axios from 'axios';

export class PixabayAPI {
  constructor() {
    this.q = null;
    this.page = null;
  }

  async fetchPhotosByQuery() {
    const BASE_URL = 'https://pixabay.com/api/';

    const searchParams = {
      params: {
        key: '33173129-c85c4e5e5fd6928dffbf93ca2',
        q: this.q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: 40,
      },
    };
    try {
      const response = await axios.get(BASE_URL, searchParams);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }
}
