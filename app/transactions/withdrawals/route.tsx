import { NextResponse } from "next/server";

import ky from "ky";
import { pgn } from "@/config/chain";
import { ethers } from "ethers";

const explorerUrl = `${pgn.blockExplorers.default.url}/api/v2/`;

async function fetchTransactions(address: string) {
  return ky(
    `${explorerUrl}/addresses/${address}/transactions?filter=to%20%7C%20from`
  )
    .json<any>()
    .then(({ items = [] }) => items);
}

export async function GET(req: Request) {
  try {
    const address = ethers.utils.getAddress(
      new URL(req.url).searchParams.get("address") as string
    );

    const withdrawals = await fetchTransactions(address);

    return NextResponse.json(withdrawals);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message });
  }
}
