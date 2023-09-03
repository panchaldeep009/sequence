import { useHostStore } from "../store/Host";
import { useUnmount } from "react-use";

export const HostRoom: React.FC = () => {
  const { teams, destroyHost, id, send } = useHostStore(
    ({ teams, destroyHost, send, id }) => ({
      teams,
      destroyHost,
      send,
      id,
    })
  );

  useUnmount(destroyHost);

  return (
    <div>
      <p>Room</p>
      <strong>Id: </strong> {id}
      <br />
      <strong>Teams: </strong>
      <ul>
        {teams.map((team) => (
          <li key={team.color}>{team.color}</li>
        ))}
      </ul>
      <button
        onClick={() =>
          send({
            type: "ping",
          })
        }
      >
        Ping
      </button>
    </div>
  );
};
