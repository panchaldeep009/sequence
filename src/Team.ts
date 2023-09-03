import z from "zod";

export const teamSchema = z
  .object({
    color: z.string(),
  })
  .transform(({ color }) => {
    return new Team(color);
  });

export class Team {
  constructor(public readonly color: string) {}
}
