"use client";

import { sepolia, useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import { TokenBridgeMessage } from "@eth-optimism/sdk";
import { ConnectWallet } from "@/components/ConnectButton";
import { Card } from "@/components/ui/Card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { timeAgo } from "@/utils/date";
import { truncate } from "@/utils/truncate";
import { usePGN } from "@/providers/PGN/PGNProvider";
import {
  useBlock,
  useChallengePeriod,
  useFinalize,
  useProve,
  useWithdrawalReceipt,
  useWithdrawalStatus,
  useWithdrawals,
} from "@/providers/PGN/hooks/transactions";

import { Button } from "@/components/ui/Button";
import { PropsWithChildren } from "react";
import { pgn } from "@/config/chain";
import { Alert } from "@/components/ui/Alert";
import Link from "next/link";

export const Transactions = () => {
  const { l1 } = usePGN();
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const isCorrectChain = chain?.network === l1.network;
  return (
    <Card className="min-w-[768px]">
      <h3 className="font-bold text-2xl mb-2">Transactions</h3>
      {address ? (
        isCorrectChain ? (
          <TransactionsTable />
        ) : (
          <div className="space-y-2">
            <Alert variant="error">
              {`You're on the wrong network. Please switch to ${l1?.name}.`}
            </Alert>
            <div className="flex justify-center">
              <Button color="primary" onClick={() => switchNetwork?.(l1?.id)}>
                Switch to {l1?.name}
              </Button>
            </div>
          </div>
        )
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
  const { data: challengePeriod } = useChallengePeriod();

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
            {Array.from({ length: 6 }).map((_, i) => (
              <Td key={i}>
                <Skeleton isLoading />
              </Td>
            ))}
          </Tr>
        ) : data?.length ? (
          data.map((tx) => (
            <TransactionRow
              key={tx.transactionHash}
              challengePeriod={challengePeriod}
              {...tx}
            />
          ))
        ) : (
          <Tr>
            <Td colSpan={6} className="text-center">
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
  3: "Ready to prove",
  4: "In challenge period",
  5: "Ready to relay",
  6: "Relayed",
};
const TransactionRow = ({
  transactionHash,
  blockNumber,
  challengePeriod = 0,
}: TokenBridgeMessage & { challengePeriod?: number }) => {
  const { data: timestamp = 0 } = useBlock(blockNumber);
  const status = useWithdrawalStatus(transactionHash);
  const receipt = useWithdrawalReceipt(transactionHash, status?.data as number);
  const l1hash = receipt.data?.transactionReceipt.transactionHash;
  const statusText =
    withdrawStatusMap[status.data as keyof typeof withdrawStatusMap] ||
    "<unknown>";

  const timeLeft = timeAgo(timestamp + challengePeriod);
  return (
    <Tr>
      <Td>
        <Link
          target="_blank"
          title={transactionHash}
          className="font-mono text-blue-700 hover:text-blue-950"
          href={`${pgn.blockExplorers.default.url}/tx/${transactionHash}`}
        >
          {truncate(transactionHash)}
        </Link>
      </Td>
      <Td>
        <Skeleton isLoading={status.isLoading}>{statusText}</Skeleton>
      </Td>
      <Td>{timestamp ? <>{timeAgo(timestamp)}</> : null}</Td>
      <Td>
        <Skeleton isLoading={receipt.isLoading}>
          {l1hash ? (
            <Link
              target="_blank"
              title={l1hash}
              className="font-mono text-blue-700 hover:text-blue-950"
              href={`${sepolia.blockExplorers.default.url}/tx/${l1hash}`}
            >
              {truncate(l1hash)}
            </Link>
          ) : (
            "N/A"
          )}
        </Skeleton>
      </Td>
      <Td>{timeLeft}</Td>
      <Td>
        <WithdrawAction hash={transactionHash} status={status.data} />
      </Td>
    </Tr>
  );
};

const WithdrawAction = ({
  hash,
  status,
}: {
  hash: string;
  status?: number;
}) => {
  const prove = useProve();
  const finalize = useFinalize();
  switch (status) {
    case 3:
      return (
        <Button
          color="primary"
          onClick={() => prove.mutate(hash)}
          disabled={prove.isLoading}
        >
          Prove
        </Button>
      );
    case 5:
      return (
        <Button
          color="primary"
          onClick={() => finalize.mutate(hash)}
          disabled={finalize.isLoading}
        >
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
