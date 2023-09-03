import { useGuestStore } from "../store/Guest";
import { useUnmount } from "react-use";

export const GuestRoom: React.FC = () => {
  const { teams, destroyGuest, send, roomId } = useGuestStore(
    ({ teams, destroyGuest, send, roomId }) => ({
      teams,
      destroyGuest,
      send,
      roomId,
    })
  );

  useUnmount(destroyGuest);

  return (
    <div>
      <p>Room</p>
      <strong>Id: </strong> {roomId}
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
