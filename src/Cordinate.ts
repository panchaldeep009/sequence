export type Coordinate = [number, number];

export const hasMatchingPosition = (
  position1: Coordinate,
  position2: Coordinate
): boolean => {
  return position1[0] === position2[0] && position1[1] === position2[1];
};
