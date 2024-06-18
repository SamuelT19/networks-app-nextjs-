// "use client";

// import { io } from "socket.io-client";
// import { useEffect } from "react";

// // Initialize the socket connection
// const socket = io();

// export const useSocket = (event: string, handler: (...args: any[]) => void) => {
//   useEffect(() => {
//     socket.on(event, handler);
//     return () => {
//       socket.off(event, handler);
//     };
//   }, [event, handler]);
// };

// export const emitSocketEvent = (event: string) => {
//   if (typeof window !== "undefined") {
//     socket.emit(event);
//   }
// };
