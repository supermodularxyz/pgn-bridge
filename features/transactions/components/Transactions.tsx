"use client";

import ky from "ky";
import { useAccount, useQuery } from "wagmi";

import { ConnectWallet } from "@/components/ConnectButton";
import { Card } from "@/components/ui/Card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { timeAgo } from "@/utils/date";
import { truncate } from "@/utils/truncate";

type Transaction = {
  hash: string;
  timestamp: string;
};
function useTransactions() {
  const { address } = useAccount();
  return useQuery<Transaction[]>(
    ["transactions", address],
    async () => ky.get(`/transactions/withdrawals?address=${address}`).json(),
    { enabled: Boolean(address) }
  );
}

export const Transactions = () => {
  const { address } = useAccount();
  return (
    <Card className="min-w-[768px]">
      <h3 className="font-bold text-2xl">Transactions</h3>
      {address ? (
        <TransactionsTable />
      ) : (
        <div className="space-y-4">
          <p>Connect your wallet to see your transactions</p>
          <div className="flex justify-center">
            <ConnectWallet />
          </div>
        </div>
      )}
    </Card>
  );
};

const TransactionsTable = () => {
  const { data, error, isLoading } = useTransactions();

  console.log(data, error, isLoading);
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Hash</Th>
          <Th>Status</Th>
          <Th>Timestamp</Th>
          <Th>L1 hash</Th>
          <Th>Time left</Th>
        </Tr>
      </Thead>
      <Tbody>
        {isLoading ? (
          <Tr>
            {Array.from({ length: 5 }).map((_, i) => (
              <Td key={i}>
                <Skeleton />
              </Td>
            ))}
          </Tr>
        ) : data?.length ? (
          data.map((tx) => (
            <Tr key={tx.hash}>
              <Td>
                <code title={tx.hash} className="font-mono">
                  {truncate(tx.hash)}
                </code>
              </Td>
              <Td>?</Td>
              <Td>{timeAgo(tx.timestamp)} ago</Td>
              <Td>?</Td>
              <Td>?</Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={5} className="text-center">
              No transactions found
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

const Skeleton = () => (
  <div className="bg-gray-300 h-4 min-w-[20px] animate-pulse" />
);
