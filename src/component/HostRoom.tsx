import { useEffect, useMemo } from "react";
import { Host } from "../Host";
import { Team } from "../Team";

export const HostRoom: React.FC<{ teams: Team[] }> = ({ teams }) => {
  const host = useMemo<Host>(() => new Host(teams), [teams]);

  useEffect(() => {
    return () => {
      host.destroy();
    };
  }, [host]);

  return (
    <div>
      <p>Room</p>
      <strong>Id: </strong> {host.id}
      <br />
      <strong>Teams: </strong>
      <ul>
        {host.teams.map((team) => (
          <li key={team.color}>{team.color}</li>
        ))}
      </ul>
      <button onClick={() => host.ping()}>Ping</button>
    </div>
  );
};
