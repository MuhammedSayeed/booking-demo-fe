import axios from "axios";

async function getSingleHotelResults({ api }: { api: string }) {
  const url = `${api}`;
  const response = await axios.get(url , {
    headers :{
      "ngrok-skip-browser-warning": "true"
    }
  });
  return response.data;
}

export default getSingleHotelResults;
