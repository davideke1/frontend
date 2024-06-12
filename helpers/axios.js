import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRefreshToken, getAccessToken, saveUserData, getUser } from '../utils/storage';

const axiosService = axios.create({
  baseURL: 'http://172.26.224.232:8000/api', // Change to your server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosService.interceptors.request.use(async (config) => {
    // Retrieving the access token from the local storage
    const accessToken = await getAccessToken();
    
    // Setting the Authorization header if access token is available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  });

axiosService.interceptors.response.use(
    (res) => Promise.resolve(res),
    (err) => Promise.reject(err)
  );
// axiosService.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       // Check if it's a 401 error and if the error object is not undefined
//       if (error && error.response && error.response.status === 401) {
//         // Do not retry the request if the refresh token request itself fails
//         if (error.config.url.includes('/user-auth/refresh/')) {
//           return Promise.reject(error);
//         }
//       }
//       return Promise.reject(error);
//     }
//   );

const refreshAuthLogic = async (failedRequest) => {
  const refreshToken = await getRefreshToken();
  console.log(refreshToken)
  return axios
    .post(
      '/user-auth/refresh/',
      { refresh: refreshToken },
      { baseURL: 'http://172.26.224.232:8000/api' } // Change to your server URL
    )
    .then(async (resp) => {
      const { access } = resp.data;
      failedRequest.response.config.headers["Authorization"] =
      "Bearer " + access;
      // Update AsyncStorage with new tokens
      const user = await getUser();
      const updatedUserData = {
        access: access,
        refresh: refreshToken,
        ...user,
      };
      await saveUserData(updatedUserData);
      
      return Promise.resolve();
    })
    .catch(async () => {
      // Clear storage on refresh failure
      await AsyncStorage.removeItem('userData');
    
      return Promise.reject();
    });
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export function fetcher(url) {
  return axiosService.get(url).then((res) => res.data);
}

export default axiosService;