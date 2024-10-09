import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL, {
  transports: ['websocket', 'polling'], 
  withCredentials: true 
});

socket.on("connect", () => {
  state.connected = true;
  console.log('Connected to Socket.IO server');
});

socket.on("disconnect", () => {
  state.connected = false;
  console.log('Disconnected from Socket.IO server');
});


socket.on("foo", (...args) => {
  state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});