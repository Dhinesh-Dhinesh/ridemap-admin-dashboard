import axios from 'axios';
import { useAppSelector } from '../redux/hooks';

const useApi = () => {
  const token = useAppSelector((state) => state.auth.user?.accessToken);

  return axios.create({
    baseURL: 'https://api-2lwctso52q-uc.a.run.app/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE',
    }
  });
};

export default useApi;