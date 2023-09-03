import { useEffect, useMemo } from "react";
import { Guest } from "../Guest";

export const GuestRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  const guest = useMemo<Guest>(() => new Guest(roomId), [roomId]);

  useEffect(() => {
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
