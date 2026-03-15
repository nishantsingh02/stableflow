"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Search,
    ExternalLink,
    Copy,
    CheckCheck,
    Filter,
    Download,
} from "lucide-react";
import { toast } from "sonner";

const ALL_TRANSACTIONS = [
    {
        id: "1",
        type: "sent",
        amount: "250.00",
        coin: "USDC",
        address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        time: "2 mins ago",
        date: "Mar 15, 2026",
        hash: "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        status: "confirmed",
        note: "Freelance payment - Logo design",
        network: "Polygon",
    },
    {
        id: "2",
        type: "received",
        amount: "1000.00",
        coin: "USDT",
        address: "0x53d284357ec70cE289D6D64134DfAc8E511c8a3D",
        time: "1 hour ago",
        date: "Mar 15, 2026",
        hash: "0xb2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
        status: "confirmed",
        note: "Client retainer - March",
        network: "Ethereum",
    },
    {
        id: "3",
        type: "sent",
        amount: "75.50",
        coin: "DAI",
        address: "0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67",
        time: "3 hours ago",
        date: "Mar 15, 2026",
        hash: "0xc3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
        status: "confirmed",
        note: "Split dinner bill",
        network: "Base",
    },
    {
        id: "4",
        type: "sent",
        amount: "500.00",
        coin: "USDC",
        address: "0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0",
        time: "5 hours ago",
        date: "Mar 15, 2026",
        hash: "0xd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5",
        status: "confirmed",
        note: "Rent contribution",
        network: "Arbitrum",
    },
    {
        id: "5",
        type: "received",
        amount: "320.00",
        coin: "USDC",
        address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
        time: "Yesterday",
        date: "Mar 14, 2026",
        hash: "0xe5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
        status: "confirmed",
        note: "Invoice #1042 payment",
        network: "Polygon",
    },
    {
        id: "6",
        type: "sent",
        amount: "1200.00",
        coin: "USDT",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        time: "Yesterday",
        date: "Mar 14, 2026",
        hash: "0xf6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1",
        status: "confirmed",
        note: "Team salary - Developer",
        network: "Ethereum",
    },
    {
        id: "7",
        type: "received",
        amount: "85.00",
        coin: "DAI",
        address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        time: "2 days ago",
        date: "Mar 13, 2026",
        hash: "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6b2c3",
        status: "confirmed",
        note: "Reimbursement - Travel",
        network: "Optimism",
    },
    {
        id: "8",
        type: "sent",
        amount: "3500.00",
        coin: "USDC",
        address: "0x8B3192f5eEBD8579568A2Ed41E6FEB402f93f73F",
        time: "2 days ago",
        date: "Mar 13, 2026",
        hash: "0xb2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6c3d4e5",
        status: "confirmed",
        note: "International vendor payment",
        network: "Arbitrum",
    },
    {
        id: "9",
        type: "received",
        amount: "650.00",
        coin: "USDT",
        address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
        time: "3 days ago",
        date: "Mar 12, 2026",
        hash: "0xc3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6d4e5f6a1",
        status: "confirmed",
        note: "Consulting fee",
        network: "Polygon",
    },
    {
        id: "10",
        type: "sent",
        amount: "45.00",
        coin: "DAI",
        address: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
        time: "4 days ago",
        date: "Mar 11, 2026",
        hash: "0xd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6e5f6a1b2c3",
        status: "confirmed",
        note: "Subscription renewal",
        network: "Base",
    },
    {
        id: "11",
        type: "received",
        amount: "2200.00",
        coin: "USDC",
        address: "0xBcd1C55633a0c78Ca5F2b4F84B8e26D7Fe9A1234",
        time: "5 days ago",
        date: "Mar 10, 2026",
        hash: "0xe5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6f6a1b2c3d4e5",
        status: "confirmed",
        note: "Project milestone payment",
        network: "Ethereum",
    },
    {
        id: "12",
        type: "sent",
        amount: "180.00",
        coin: "USDT",
        address: "0xCd2a3d9F938E13cD947eC05ABC7Fe734Df8DD826",
        time: "1 week ago",
        date: "Mar 8, 2026",
        hash: "0xf6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f601",
        status: "confirmed",
        note: "Design assets purchase",
        network: "Polygon",
    },
    {
        id: "13",
        type: "received",
        amount: "900.00",
        coin: "USDC",
        address: "0xDe0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
        time: "1 week ago",
        date: "Mar 8, 2026",
        hash: "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6c3d4",
        status: "confirmed",
        note: "Referral bonus",
        network: "Arbitrum",
    },
    {
        id: "14",
        type: "sent",
        amount: "60.00",
        coin: "DAI",
        address: "0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B",
        time: "2 weeks ago",
        date: "Mar 1, 2026",
        hash: "0xb2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6d4e5f6",
        status: "confirmed",
        note: "Coffee & team lunch",
        network: "Base",
    },
    {
        id: "15",
        type: "received",
        amount: "4500.00",
        coin: "USDT",
        address: "0xF7e4BC0A9Fb6E7A3cD4bC1e6A5D0123456789ABC",
        time: "2 weeks ago",
        date: "Mar 1, 2026",
        hash: "0xc3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6e5f6a1b2",
        status: "confirmed",
        note: "Annual contract payment",
        network: "Ethereum",
    },
];

const COIN_BADGE: Record<string, string> = {
    USDC: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    USDT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    DAI: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const NETWORK_BADGE: Record<string, string> = {
    Ethereum: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Polygon: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    Arbitrum: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Base: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Optimism: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function HistoryPage() {
    const { isConnected } = useAccount();
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterCoin, setFilterCoin] = useState("all");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (hash: string, id: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedId(id);
        toast.success("Transaction hash copied!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleExport = () => {
        const csv = [
            ["Date", "Type", "Amount", "Coin", "Address", "Note", "Network", "Hash"],
            ...ALL_TRANSACTIONS.map((tx) => [
                tx.date,
                tx.type,
                tx.amount,
                tx.coin,
                tx.address,
                tx.note,
                tx.network,
                tx.hash,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "stableflow-transactions.csv";
        a.click();
        toast.success("Transactions exported as CSV!");
    };

    const filtered = ALL_TRANSACTIONS.filter((tx) => {
        const matchType = filterType === "all" || tx.type === filterType;
        const matchCoin = filterCoin === "all" || tx.coin === filterCoin;
        const matchSearch =
            search === "" ||
            tx.address.toLowerCase().includes(search.toLowerCase()) ||
            tx.note.toLowerCase().includes(search.toLowerCase()) ||
            tx.coin.toLowerCase().includes(search.toLowerCase()) ||
            tx.hash.toLowerCase().includes(search.toLowerCase());
        return matchType && matchCoin && matchSearch;
    });

    const totalVolume = filtered.reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Wallet className="w-8 h-8 text-white/40" />
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2">Wallet Not Connected</h2>
                    <p className="text-white/40 text-sm mb-6">
                        Connect your wallet to view transaction history
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

            <div className="relative max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black mb-1">Transaction History</h1>
                        <p className="text-white/40 text-sm">
                            All your stablecoin payments in one place
                        </p>
                    </div>
                    <Button
                        onClick={handleExport}
                        variant="outline"
                        className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl self-start sm:self-auto"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <Input
                            placeholder="Search by address, note or hash..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-10 pl-9 focus-visible:ring-emerald-500"
                        />
                    </div>

                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10 w-full sm:w-36 focus:ring-emerald-500">
                            <Filter className="w-3.5 h-3.5 mr-2 text-white/40" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                            <SelectItem value="all" className="focus:bg-white/10 focus:text-white">All Types</SelectItem>
                            <SelectItem value="sent" className="focus:bg-white/10 focus:text-white">Sent</SelectItem>
                            <SelectItem value="received" className="focus:bg-white/10 focus:text-white">Received</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterCoin} onValueChange={setFilterCoin}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10 w-full sm:w-36 focus:ring-emerald-500">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                            <SelectItem value="all" className="focus:bg-white/10 focus:text-white">All Coins</SelectItem>
                            <SelectItem value="USDC" className="focus:bg-white/10 focus:text-white">USDC</SelectItem>
                            <SelectItem value="USDT" className="focus:bg-white/10 focus:text-white">USDT</SelectItem>
                            <SelectItem value="DAI" className="focus:bg-white/10 focus:text-white">DAI</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Summary Bar */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
                    <div>
                        <p className="text-white/40 text-xs">Showing</p>
                        <p className="text-white font-bold">{filtered.length} transactions</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div>
                        <p className="text-white/40 text-xs">Total Volume</p>
                        <p className="text-white font-bold">${totalVolume.toLocaleString()}</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div>
                        <p className="text-white/40 text-xs">Sent</p>
                        <p className="text-red-400 font-bold">
                            {filtered.filter((t) => t.type === "sent").length} txns
                        </p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div>
                        <p className="text-white/40 text-xs">Received</p>
                        <p className="text-emerald-400 font-bold">
                            {filtered.filter((t) => t.type === "received").length} txns
                        </p>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <Search className="w-10 h-10 text-white/20 mx-auto mb-3" />
                            <p className="text-white/40">No transactions found</p>
                            <p className="text-white/20 text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        filtered.map((tx, i) => (
                            <div
                                key={tx.id}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-white/[0.02] transition-colors ${i !== filtered.length - 1 ? "border-b border-white/5" : ""
                                    }`}
                            >
                                {/* Left */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === "sent"
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
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-white text-sm font-medium capitalize">
                                                {tx.type}
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full border ${COIN_BADGE[tx.coin]}`}
                                            >
                                                {tx.coin}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full border ${NETWORK_BADGE[tx.network]}`}
                                            >
                                                {tx.network}
                                            </span>
                                        </div>
                                        <p className="text-white/30 text-xs font-mono mt-0.5">
                                            {tx.address.slice(0, 10)}...{tx.address.slice(-8)}
                                        </p>
                                        {tx.note && (
                                            <p className="text-white/30 text-xs italic mt-0.5">
                                                {tx.note}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                    <p
                                        className={`text-sm font-bold font-mono ${tx.type === "sent" ? "text-red-400" : "text-emerald-400"
                                            }`}
                                    >
                                        {tx.type === "sent" ? "-" : "+"}
                                        {tx.amount} {tx.coin}
                                    </p>
                                    <p className="text-white/30 text-xs">{tx.date}</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleCopy(tx.hash, tx.id)}
                                            className="text-white/20 hover:text-white/60 transition-colors"
                                            title="Copy hash"
                                        >
                                            {copiedId === tx.id ? (
                                                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                        <a
                                            href={`https://etherscan.io/tx/${tx.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white/20 hover:text-emerald-400 transition-colors"
                                            title="View on explorer"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
