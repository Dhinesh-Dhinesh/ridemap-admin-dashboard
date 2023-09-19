import axios from 'axios';
import { useAppSelector } from '../redux/hooks';

const useApi = () => {
  const token = useAppSelector((state) => state.auth.user?.accessToken);

  return axios.create({
    baseURL: import.meta.env.VITE_API_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE',
    }
  });
};

export default useApi;