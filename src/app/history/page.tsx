"use client";

import { useState, useEffect } from "react";
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
    Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { getTransactions, type Transaction } from "@/lib/transactions";

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

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterCoin, setFilterCoin] = useState("all");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        setTransactions(getTransactions());
    }, []);

    const handleCopy = (hash: string, id: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedId(id);
        toast.success("Transaction hash copied!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleExport = () => {
        const csv = [
            ["Date", "Type", "Amount", "Coin", "Address", "Note", "Network", "Hash"],
            ...transactions.map((tx) => [
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

    const filtered = transactions.filter((tx) => {
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

    const totalVolume = filtered.reduce(
        (acc, tx) => acc + parseFloat(tx.amount),
        0
    );

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
                            <SelectItem value="all" className="focus:bg-white/10 focus:text-white">
                                All Types
                            </SelectItem>
                            <SelectItem value="sent" className="focus:bg-white/10 focus:text-white">
                                Sent
                            </SelectItem>
                            <SelectItem value="received" className="focus:bg-white/10 focus:text-white">
                                Received
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterCoin} onValueChange={setFilterCoin}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10 w-full sm:w-36 focus:ring-emerald-500">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                            <SelectItem value="all" className="focus:bg-white/10 focus:text-white">
                                All Coins
                            </SelectItem>
                            <SelectItem value="USDC" className="focus:bg-white/10 focus:text-white">
                                USDC
                            </SelectItem>
                            <SelectItem value="USDT" className="focus:bg-white/10 focus:text-white">
                                USDT
                            </SelectItem>
                            <SelectItem value="DAI" className="focus:bg-white/10 focus:text-white">
                                DAI
                            </SelectItem>
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
                        <p className="text-white font-bold">
                            ${totalVolume.toLocaleString()}
                        </p>
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
                            {transactions.length === 0 ? (
                                <>
                                    <Inbox className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                    <p className="text-white/40">No transactions yet</p>
                                    <p className="text-white/20 text-sm mt-1 mb-4">
                                        Send your first payment to see it here
                                    </p>
                                    <Button
                                        onClick={() => router.push("/send")}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl"
                                    >
                                        Send Payment
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Search className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                    <p className="text-white/40">No transactions match your filters</p>
                                    <p className="text-white/20 text-sm mt-1">
                                        Try adjusting your search
                                    </p>
                                </>
                            )}
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
                                                className={`text-xs px-2 py-0.5 rounded-full border ${COIN_BADGE[tx.coin] ?? "bg-white/5 text-white/40 border-white/10"
                                                    }`}
                                            >
                                                {tx.coin}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full border ${NETWORK_BADGE[tx.network] ?? "bg-white/5 text-white/40 border-white/10"
                                                    }`}
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