import { useState } from "react";
import { GuestRoom } from "./GuestRoom";
import { Team } from "../Team";
import { HostRoom } from "./HostRoom";
import { useHostStore } from "../store/Host";
import { useGuestStore } from "../store/Guest";

const Teams = [new Team("blue"), new Team("green"), new Team("red")];

export const App: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [roomId, setRoomId] = useState<string>();

  const { createHost, host } = useHostStore(({ createHost, host }) => ({
    createHost,
    host,
  }));

  const { createGuest, guest } = useGuestStore(({ createGuest, guest }) => ({
    createGuest,
    guest,
  }));

  if (host) {
    return <HostRoom />;
  }

  if (guest) {
    return <GuestRoom />;
  }

  return (
    <div className="App">
      <label>Select Teams</label>
      <div>
        {Teams.map((team) => (
          <label key={team.color}>
            <input
              type="checkbox"
              checked={selectedTeams.includes(team)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedTeams([...selectedTeams, team]);
                } else {
                  setSelectedTeams(selectedTeams.filter((t) => t !== team));
                }
              }}
            />
            <strong>{team.color}</strong>
          </label>
        ))}
      </div>
      <button
        onClick={() => {
          if (selectedTeams.length < 2) {
            alert("You must select at least 2 teams");
            return;
          }

          createHost(selectedTeams);
        }}
      >
        Host Game
      </button>
      <hr />
      <input
        type="text"
        placeholder="Enter Room ID"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        onClick={() => {
          if (!roomId) {
            return;
          }

          createGuest(roomId);
        }}
      >
        Join Room
      </button>
    </div>
  );
};
