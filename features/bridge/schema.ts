import { z } from "zod";

export const BridgeSchema = z.object({
  amount: z.number(),
  token: z.string(),
});
export const Actions = {
  Deposit: "Deposit",
  Withdraw: "Withdraw",
};
