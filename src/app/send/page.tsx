"use client";

import { useState } from "react";
import { useAccount, useChainId, useSendTransaction, useWriteContract } from "wagmi";
import { parseUnits, isAddress } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowRight,
    Wallet,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Send,
    ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
    SUPPORTED_STABLECOINS,
    CHAIN_NAMES,
    type SupportedStablecoin,
} from "@/lib/web3-config";
import { useRouter } from "next/navigation";

import {
  saveTransaction,
  generateTxId,
  formatTxDate,
} from "@/lib/transactions";

const ERC20_ABI = [
    {
        name: "transfer",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
] as const;

type TxStatus = "idle" | "pending" | "success" | "error";

export default function SendPage() {
    const { isConnected, address } = useAccount();
    const chainId = useChainId();
    const router = useRouter();

    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCoin, setSelectedCoin] = useState<SupportedStablecoin>("USDC");
    const [note, setNote] = useState("");
    const [txStatus, setTxStatus] = useState<TxStatus>("idle");
    const [txHash, setTxHash] = useState("");

    const { writeContractAsync } = useWriteContract();

    const isValidAddress = recipient.length > 0 && isAddress(recipient);
    const isValidAmount = parseFloat(amount) > 0 && !isNaN(parseFloat(amount));
    const canSend = isValidAddress && isValidAmount && isConnected;

    const selectedCoinData = SUPPORTED_STABLECOINS[selectedCoin];
    const tokenAddress =
        selectedCoinData.addresses[chainId as keyof typeof selectedCoinData.addresses];

    const handleSend = async () => {
        if (!canSend) return;

        if (!tokenAddress || tokenAddress === "0x") {
            toast.error("Token not supported on this network", {
                description: `Switch to a supported chain for ${selectedCoin}`,
            });
            return;
        }

        setTxStatus("pending");

        try {
            const hash = await writeContractAsync({
                address: tokenAddress as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "transfer",
                args: [
                    recipient as `0x${string}`,
                    parseUnits(amount, selectedCoinData.decimals),
                ],
            });

            setTxHash(hash);
setTxStatus("success");
const { date, time } = formatTxDate();
saveTransaction({
  id: generateTxId(),
  type: "sent",
  amount,
  coin: selectedCoin,
  address: recipient,
  note,
  network: chainName,
  hash,
  date,
  time,
  status: "confirmed",
});

toast.success("Payment sent!", {
  description: `${amount} ${selectedCoin} sent successfully`,
});
        } catch (err: any) {
            setTxStatus("error");
            toast.error("Transaction failed", {
                description: err?.shortMessage ?? err?.message ?? "Something went wrong",
            });
        }
    };

    const handleReset = () => {
        setTxStatus("idle");
        setTxHash("");
        setRecipient("");
        setAmount("");
        setNote("");
    };

    const chainName = CHAIN_NAMES[chainId] ?? "Unknown Network";

    // Not connected state
    if (!isConnected) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Wallet className="w-8 h-8 text-white/40" />
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2">Wallet Not Connected</h2>
                    <p className="text-white/40 text-sm mb-6">
                        Connect your wallet to send payments
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

    // Success state
    if (txStatus === "success") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-white text-3xl font-black mb-2">Payment Sent!</h2>
                    <p className="text-white/40 mb-2">
                        {amount} {selectedCoin} sent to
                    </p>
                    <p className="text-white/60 font-mono text-sm mb-6">
                        {recipient.slice(0, 10)}...{recipient.slice(-8)}
                    </p>

                    {txHash && (
                        <a
                            href={`https://etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 text-sm hover:underline mb-8"
                        >
                            View on Explorer
                            <ArrowRight className="w-3 h-3" />
                        </a>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={handleReset}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl"
                        >
                            Send Another
                        </Button>
                        <Button
                            onClick={() => router.push("/dashboard")}
                            variant="outline"
                            className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                        >
                            Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 py-12">
            {/* Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-lg mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-1">Send Payment</h1>
                    <p className="text-white/40 text-sm">
                        Instant stablecoin transfer — anywhere in the world
                    </p>
                </div>

                {/* Network Badge */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/50 text-sm">
                        Connected on{" "}
                        <span className="text-white font-medium">{chainName}</span>
                    </span>
                </div>

                {/* Form Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">

                    {/* Stablecoin Selector */}
                    <div className="space-y-2">
                        <Label className="text-white/60 text-sm">Stablecoin</Label>
                        <Select
                            value={selectedCoin}
                            onValueChange={(v) => setSelectedCoin(v as SupportedStablecoin)}
                        >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-emerald-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                                {Object.values(SUPPORTED_STABLECOINS).map((coin) => (
                                    <SelectItem
                                        key={coin.symbol}
                                        value={coin.symbol}
                                        className="focus:bg-white/10 focus:text-white rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{coin.symbol}</span>
                                            <span className="text-white/40 text-xs">{coin.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label className="text-white/60 text-sm">Amount</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 pr-16 focus-visible:ring-emerald-500 text-lg font-mono"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium">
                                {selectedCoin}
                            </span>
                        </div>
                    </div>

                    {/* Recipient */}
                    <div className="space-y-2">
                        <Label className="text-white/60 text-sm">Recipient Address</Label>
                        <div className="relative">
                            <Input
                                placeholder="0x..."
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 font-mono text-sm focus-visible:ring-emerald-500 pr-10"
                            />
                            {recipient.length > 0 && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {isValidAddress ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                    )}
                                </div>
                            )}
                        </div>
                        {recipient.length > 0 && !isValidAddress && (
                            <p className="text-red-400 text-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Invalid wallet address
                            </p>
                        )}
                    </div>

                    {/* Note (optional) */}
                    <div className="space-y-2">
                        <Label className="text-white/60 text-sm">
                            Note{" "}
                            <span className="text-white/30">(optional)</span>
                        </Label>
                        <Input
                            placeholder="What's this for?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 focus-visible:ring-emerald-500"
                        />
                    </div>

                    {/* Summary */}
                    {isValidAmount && isValidAddress && (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                            <p className="text-white/60 text-xs uppercase tracking-wider mb-3">
                                Transaction Summary
                            </p>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/40">You send</span>
                                <span className="text-white font-medium">
                                    {amount} {selectedCoin}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/40">Network fee</span>
                                <span className="text-emerald-400 font-medium">~$0.01</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/40">They receive</span>
                                <span className="text-white font-bold">
                                    {amount} {selectedCoin}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/40">Network</span>
                                <span className="text-white/60">{chainName}</span>
                            </div>
                        </div>
                    )}

                    {/* Send Button */}
                    <Button
                        onClick={handleSend}
                        disabled={!canSend || txStatus === "pending"}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold rounded-xl h-12 text-base"
                    >
                        {txStatus === "pending" ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Confirming in Wallet...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Send {amount ? `${amount} ${selectedCoin}` : "Payment"}
                            </>
                        )}
                    </Button>
                </div>

                {/* Disclaimer */}
                <p className="text-white/20 text-xs text-center mt-4">
                    Transactions are irreversible. Always double-check the recipient address.
                </p>
            </div>
        </div>
    );
}