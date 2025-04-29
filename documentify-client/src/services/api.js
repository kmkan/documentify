import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
});

export const createRoom = async (roomName) => {
  const response = await API.post('/rooms', { roomName }); 
  return response.data;
};

export const getRoom = async (roomId) => {
  const response = await API.get(`/rooms/${roomId}`);
  return response.data;
};

export const updateRoom = async (roomId, document) => {
  const response = await API.patch(`/rooms/${roomId}`, { document });
  return response.data;
};
