import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
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
