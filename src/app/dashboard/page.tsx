"use client";

import { useAccount, useChainId, useBalance } from "wagmi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Send,
  Globe,
  TrendingUp,
  Copy,
  CheckCheck,
  ExternalLink,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CHAIN_NAMES, SUPPORTED_STABLECOINS } from "@/lib/web3-config";
import { useReadContract } from "wagmi";

const ERC20_BALANCE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// demo transections
const MOCK_TRANSACTIONS = [
  {
    id: "1",
    type: "sent",
    amount: "250.00",
    coin: "USDC",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    time: "2 mins ago",
    hash: "0xabc123",
    status: "confirmed",
  },
  {
    id: "2",
    type: "received",
    amount: "1000.00",
    coin: "USDT",
    address: "0x53d284357ec70cE289D6D64134DfAc8E511c8a3D",
    time: "1 hour ago",
    hash: "0xdef456",
    status: "confirmed",
  },
  {
    id: "3",
    type: "sent",
    amount: "75.50",
    coin: "DAI",
    address: "0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67",
    time: "3 hours ago",
    hash: "0xghi789",
    status: "confirmed",
  },
  {
    id: "4",
    type: "sent",
    amount: "500.00",
    coin: "USDC",
    address: "0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0",
    time: "Yesterday",
    hash: "0xjkl012",
    status: "confirmed",
  },
  {
    id: "5",
    type: "received",
    amount: "320.00",
    coin: "USDC",
    address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    time: "2 days ago",
    hash: "0xmno345",
    status: "confirmed",
  },
];

function TokenBalanceCard({
  symbol,
  address,
  chainId,
  walletAddress,
}: {
  symbol: string;
  address: string;
  chainId: number;
  walletAddress: `0x${string}`;
}) {
  const { data: balance } = useReadContract({
    address: address as `0x${string}`,
    abi: ERC20_BALANCE_ABI,
    functionName: "balanceOf",
    args: [walletAddress],
  });

  const coin = SUPPORTED_STABLECOINS[symbol as keyof typeof SUPPORTED_STABLECOINS];
  const decimals = coin?.decimals ?? 6;
  const formatted = balance
    ? (Number(balance) / 10 ** decimals).toFixed(2)
    : "0.00";

  const COIN_COLORS: Record<string, { text: string; bg: string; border: string }> = {
    USDC: {
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    USDT: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    DAI: {
      text: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
  };

  const colors = COIN_COLORS[symbol] ?? {
    text: "text-white",
    bg: "bg-white/5",
    border: "border-white/10",
  };

  return (
    <div
      className={`${colors.bg} border ${colors.border} rounded-2xl p-5 hover:scale-[1.02] transition-transform`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
          {symbol}
        </span>
        <span className="text-white/30 text-xs">{coin?.name}</span>
      </div>
      <p className="text-white text-2xl font-black font-mono">{formatted}</p>
      <p className="text-white/40 text-xs mt-1">${formatted} USD</p>
    </div>
  );
}

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const { data: nativeBalance } = useBalance({ address });

  const chainName = CHAIN_NAMES[chainId] ?? "Unknown";

  const shortAddress = address
    ? `${address.slice(0, 8)}...${address.slice(-6)}`
    : "";

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const totalSent = MOCK_TRANSACTIONS.filter((t) => t.type === "sent").reduce(
    (acc, t) => acc + parseFloat(t.amount),
    0
  );

  const totalReceived = MOCK_TRANSACTIONS.filter(
    (t) => t.type === "received"
  ).reduce((acc, t) => acc + parseFloat(t.amount), 0);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white/40" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">
            Wallet Not Connected
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Connect your wallet to view your dashboard
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black mb-1">Dashboard</h1>
            <p className="text-white/40 text-sm">
              Your stablecoin payment overview
            </p>
          </div>
          <Button
            onClick={() => router.push("/send")}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl self-start sm:self-auto"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Payment
          </Button>
        </div>

        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                Connected Wallet
              </p>
              <div className="flex items-center gap-2">
                <p className="text-white font-mono text-lg font-bold">
                  {shortAddress}
                </p>
                <button
                  onClick={handleCopy}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  {copied ? (
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/50 text-xs">{chainName}</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                Native Balance
              </p>
              <p className="text-white text-2xl font-black font-mono">
                {nativeBalance
                  ? (Number(nativeBalance.value) / 1e18).toFixed(4)
                  : "0.0000"}
              </p>
              <p className="text-white/40 text-xs">
                {nativeBalance?.symbol ?? "ETH"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight className="w-4 h-4 text-red-400" />
              <span className="text-white/50 text-xs uppercase tracking-wider">
                Total Sent
              </span>
            </div>
            <p className="text-white text-2xl font-black font-mono">
              ${totalSent.toFixed(2)}
            </p>
            <p className="text-white/30 text-xs mt-1">All time</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              <span className="text-white/50 text-xs uppercase tracking-wider">
                Total Received
              </span>
            </div>
            <p className="text-white text-2xl font-black font-mono">
              ${totalReceived.toFixed(2)}
            </p>
            <p className="text-white/30 text-xs mt-1">All time</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white/50 text-xs uppercase tracking-wider">
                Transactions
              </span>
            </div>
            <p className="text-white text-2xl font-black font-mono">
              {MOCK_TRANSACTIONS.length}
            </p>
            <p className="text-white/30 text-xs mt-1">All time</p>
          </div>
        </div>

        {/* Token Balances */}
        <div className="mb-6">
          <h2 className="text-white font-bold text-lg mb-4">
            Stablecoin Balances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(SUPPORTED_STABLECOINS).map(([symbol, coin]) => {
              const tokenAddress =
                coin.addresses[chainId as keyof typeof coin.addresses];
              if (!tokenAddress || tokenAddress === "0x") return null;
              return (
                <TokenBalanceCard
                  key={symbol}
                  symbol={symbol}
                  address={tokenAddress}
                  chainId={chainId}
                  walletAddress={address!}
                />
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">
              Recent Transactions
            </h2>
            <button
              onClick={() => router.push("/history")}
              className="text-emerald-400 text-sm hover:underline flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            {MOCK_TRANSACTIONS.map((tx, i) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors ${
                  i !== MOCK_TRANSACTIONS.length - 1
                    ? "border-b border-white/5"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      tx.type === "sent"
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-emerald-500/10 border border-emerald-500/20"
                    }`}
                  >
                    {tx.type === "sent" ? (
                      <ArrowUpRight className="w-4 h-4 text-red-400" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium capitalize">
                      {tx.type}
                    </p>
                    <p className="text-white/30 text-xs font-mono">
                      {tx.address.slice(0, 8)}...{tx.address.slice(-6)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-bold font-mono ${
                      tx.type === "sent" ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {tx.type === "sent" ? "-" : "+"}
                    {tx.amount} {tx.coin}
                  </p>
                  <p className="text-white/30 text-xs">{tx.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
