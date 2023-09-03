import { useState } from "react";
import { GuestRoom } from "./GuestRoom";
import { Team } from "../Team";
import { HostRoom } from "./HostRoom";

const Teams = [new Team("blue"), new Team("green"), new Team("red")];

export const App: React.FC = () => {
  const [isHosting, setIsHosting] = useState<boolean>();
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [roomId, setRoomId] = useState<string>();

  if (isHosting === true && selectedTeams.length > 0) {
    return <HostRoom teams={selectedTeams} />;
  }

  if (isHosting === false && roomId) {
    return <GuestRoom roomId={roomId} />;
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

          setIsHosting(true);
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
          setIsHosting(false);
        }}
      >
        Join Room
      </button>
    </div>
  );
};
