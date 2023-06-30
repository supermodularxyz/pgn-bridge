"use client";

import { useAccount, useQuery } from "wagmi";

import { TokenBridgeMessage } from "@eth-optimism/sdk";
import { ConnectWallet } from "@/components/ConnectButton";
import { Card } from "@/components/ui/Card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { timeAgo } from "@/utils/date";
import { truncate } from "@/utils/truncate";
import {
  useWithdrawalReceipt,
  useWithdrawalStatus,
  useWithdrawals,
} from "@/providers/PGN";
import { Button } from "@/components/ui/Button";
import { PropsWithChildren } from "react";

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
  const { data, error, isLoading } = useWithdrawals();

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
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {isLoading ? (
          <Tr>
            {Array.from({ length: 5 }).map((_, i) => (
              <Td key={i}>
                <Skeleton isLoading />
              </Td>
            ))}
          </Tr>
        ) : data?.length ? (
          data.map((tx) => <TransactionRow key={tx.transactionHash} {...tx} />)
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

const withdrawStatusMap = {
  2: "Waiting for state root",
  4: "In challenge period",
  6: "Relayed",
};
const TransactionRow = ({ transactionHash }: TokenBridgeMessage) => {
  const status = useWithdrawalStatus(transactionHash);
  const receipt = useWithdrawalReceipt(transactionHash, status.data as number);
  console.log(status.data, status.error);
  const l1hash = receipt.data?.transactionReceipt.transactionHash;
  const statusText =
    withdrawStatusMap[status.data as keyof typeof withdrawStatusMap] ||
    "<unknown>";
  return (
    <Tr>
      <Td>
        <code title={transactionHash} className="font-mono">
          {truncate(transactionHash)}
        </code>
      </Td>
      <Td>
        <Skeleton isLoading={status.isLoading}>{statusText}</Skeleton>
      </Td>
      <Td>? d ago</Td>
      {/* <Td>{timeAgo(timestamp)}x ago</Td> */}
      <Td>
        <Skeleton isLoading={receipt.isLoading}>{truncate(l1hash)}</Skeleton>
      </Td>
      <Td>?</Td>
      <Td>
        <WithdrawAction status={status.data} />
      </Td>
    </Tr>
  );
};

const WithdrawAction = ({ status }: { status?: number }) => {
  switch (status) {
    case 3:
      return (
        <Button color="primary" onClick={() => alert("not implemented")}>
          Prove
        </Button>
      );
    case 5:
      return (
        <Button color="primary" onClick={() => alert("not implemented")}>
          Finalize
        </Button>
      );
    default:
      return null;
  }
};

const Skeleton = ({
  isLoading = false,
  children,
}: PropsWithChildren & { isLoading: boolean }) =>
  isLoading ? (
    <div className="bg-gray-300 h-4 min-w-[20px] animate-pulse" />
  ) : (
    <>{children}</>
  );
