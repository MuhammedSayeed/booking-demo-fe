import axios from "axios";

async function getSearchResults({
  api,
  search,
  checkin,
  checkout,
  guests,
  page,
  lang
}: {
  api: string;
  search: string;
  checkin?: string;
  checkout?: string;
  lang?: string;
  guests?: string;
  page?: number | string;
}) {
  const url = `${api}?search=${search}&page=${page}&lang=${lang}`;
  const response = await axios.get(url , {
    headers :{
      "ngrok-skip-browser-warning": "true"
    }
  });
  return response.data;
}

export default getSearchResults;

/**
 * 
 * {
    "destination": "Munawwarah",
    "checkin": "Sun Jun 08 2025 00:00:00 GMT+0300 (Eastern European Summer Time)",
    "checkout": "Mon Jun 09 2025 00:00:00 GMT+0300 (Eastern European Summer Time)",
    "guests": "3"
}
 */
