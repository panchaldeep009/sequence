import { useEffect } from "react";
import { Guest } from "../Guest";

const guest = new Guest();
guest.events.on("teams", ({ teams }) => console.log(teams));

export const GuestRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  useEffect(() => {
    guest.connect(roomId);

    return () => {
      guest.destroy();
    };
  }, [guest]);

  return (
    <div>
      <p>Room</p>
      <strong>Id: </strong> {roomId}
      <br />
      <button onClick={() => guest.ping()}>Ping</button>
    </div>
  );
};
