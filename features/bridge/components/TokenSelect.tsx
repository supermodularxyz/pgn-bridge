"use client";
import { Label, Select } from "@/components/ui/Form";
import { useFormContext } from "react-hook-form";

import { tokens } from "@/config/tokens";

export function TokenSelect() {
  const form = useFormContext();
  return (
    <div>
      <Label>
        Asset
        <Select
          className="w-full text-lg font-bold"
          {...form.register("token")}
        >
          {tokens.map((token) => (
            <option key={token.l1Address} value={token.l1Address}>
              {token.name}
            </option>
          ))}
        </Select>
      </Label>
    </div>
  );
}
