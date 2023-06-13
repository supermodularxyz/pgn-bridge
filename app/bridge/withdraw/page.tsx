import { BridgeTokens } from "@/features/bridge/components/BridgeTokens";
import { Actions } from "@/features/bridge/schema";

export default function Withdraw() {
  return <BridgeTokens action={Actions.Withdraw} />;
}
