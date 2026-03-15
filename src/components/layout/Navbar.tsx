"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount, useDisconnect, useConnect, useBalance } from "wagmi";
import { metaMask, coinbaseWallet, injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Wallet,
    LogOut,
    ChevronDown,
    Zap,
    Globe,
    BarChart3,
    History,
} from "lucide-react";
import { toast } from "sonner";
import { CHAIN_NAMES } from "@/lib/web3-config";

export function Navbar() {
    const { address, isConnected, chainId } = useAccount();
    const { disconnect } = useDisconnect();
    const { connect, connectors, isPending } = useConnect();
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const { data: balance } = useBalance({
        address,
    });

    const shortAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "";

    const chainName = chainId ? CHAIN_NAMES[chainId] ?? "Unknown" : "";

    const handleConnect = async (connector: (typeof connectors)[number]) => {
        try {
            connect(
                { connector },
                {
                    onSuccess: () => {
                        toast.success("Wallet connected!", {
                            description: "You are now connected to StableFlow",
                        });
                        setShowWalletModal(false);
                    },
                    onError: (err) => {
                        toast.error("Connection failed", { description: err.message });
                    },
                }
            );
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    const handleDisconnect = () => {
        disconnect();
        setShowAccountMenu(false);
        toast.info("Wallet disconnected");
    };

    const WALLET_OPTIONS = [
        {
            name: "MetaMask",
            icon: "🦊",
            connector: connectors.find((c) => c.id === "metaMask") ?? connectors[0],
        },
        {
            name: "Coinbase Wallet",
            icon: "🔵",
            connector:
                connectors.find((c) => c.id === "coinbaseWallet") ?? connectors[0],
        },
        {
            name: "Browser Wallet",
            icon: "🌐",
            connector: connectors.find((c) => c.id === "injected") ?? connectors[0],
        },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-black" />
                            </div>
                            <span className="text-white font-bold text-xl tracking-tight">
                                Stable<span className="text-emerald-400">Flow</span>
                            </span>
                        </Link>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/send"
                                className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
                            >
                                <Globe className="w-4 h-4" />
                                Send
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/history"
                                className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
                            >
                                <History className="w-4 h-4" />
                                History
                            </Link>
                        </div>

                        {/* Wallet Button */}
                        <div className="flex items-center gap-3">
                            {isConnected ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowAccountMenu(!showAccountMenu)}
                                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition-all"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-white text-sm font-mono">
                                            {shortAddress}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="text-xs border-emerald-500/30 text-emerald-400 hidden sm:flex"
                                        >
                                            {chainName}
                                        </Badge>
                                        <ChevronDown className="w-3 h-3 text-white/40" />
                                    </button>

                                    {/* Dropdown */}
                                    {showAccountMenu && (
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-white/10 rounded-2xl p-3 shadow-2xl">
                                            <div className="px-2 py-1.5 mb-2">
                                                <p className="text-white/40 text-xs mb-0.5">
                                                    Connected as
                                                </p>
                                                <p className="text-white text-sm font-mono">
                                                    {shortAddress}
                                                </p>
                                                {balance && (
                                                    <p className="text-emerald-400 text-xs mt-1">
                                                        {(Number(balance?.value ?? 0) / 1e18).toFixed(4)}{" "}{balance?.symbol}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="border-t border-white/10 pt-2">
                                                <button
                                                    onClick={handleDisconnect}
                                                    className="w-full flex items-center gap-2 px-2 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Disconnect Wallet
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Button
                                    onClick={() => setShowWalletModal(true)}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl"
                                >
                                    <Wallet className="w-4 h-4 mr-2" />
                                    Connect Wallet
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Wallet Selection Modal */}
            <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
                <DialogContent className="bg-zinc-900 border-white/10 text-white rounded-2xl max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            Connect Wallet
                        </DialogTitle>
                        <p className="text-white/50 text-sm">
                            Choose your wallet to get started
                        </p>
                    </DialogHeader>

                    <div className="flex flex-col gap-2 mt-2">
                        {WALLET_OPTIONS.map((wallet) => (
                            <button
                                key={wallet.name}
                                onClick={() => handleConnect(wallet.connector)}
                                disabled={isPending}
                                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-xl transition-all text-left disabled:opacity-50"
                            >
                                <span className="text-2xl">{wallet.icon}</span>
                                <div>
                                    <p className="text-white font-medium text-sm">
                                        {wallet.name}
                                    </p>
                                    <p className="text-white/40 text-xs">
                                        {isPending ? "Connecting..." : "Click to connect"}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <p className="text-white/30 text-xs text-center mt-2">
                        By connecting, you agree to our Terms of Service
                    </p>
                </DialogContent>
            </Dialog>
        </>
    );
}