import { BridgeTokens } from "@/features/bridge/components/BridgeTokens";
import { Actions } from "@/features/bridge/schema";

export default function Deposit() {
  return <BridgeTokens action={Actions.Deposit} />;
}
