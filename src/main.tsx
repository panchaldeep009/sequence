import "./style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Peer } from "peerjs";

const App = () => {
  const [roomID, setRoomID] = React.useState<string | undefined>();

  if (roomID) {
    return (
      <div className="App">
        <div id="game"></div>
        <h1>Room ID: {roomID}</h1>
        <hr />
        <button>Leave Room</button>
      </div>
    );
  }

  const createRoom = () => {
    const peer = new Peer(`sequence-${}`);
    peer.on("open", (id) => {
      setRoomID(id);
    });
  };

  return (
    <div className="App">
      <button>Create Room</button>
      <hr />
      <input type="text" placeholder="Enter Room ID" />
      <button>Join Room</button>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
