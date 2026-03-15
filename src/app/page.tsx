"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Globe,
  Shield,
  ArrowRight,
  Clock,
  DollarSign,
  ChevronRight,
} from "lucide-react";

const STATS = [
  { label: "Transaction Speed", value: "< 3 sec", icon: Clock },
  { label: "Avg. Fee", value: "~$0.01", icon: DollarSign },
  { label: "Countries Supported", value: "180+", icon: Globe },
  { label: "Uptime", value: "99.99%", icon: Shield },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Settlement",
    description:
      "Payments settle in seconds, not days. No waiting for SWIFT or correspondent banks.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Globe,
    title: "Send Anywhere",
    description:
      "Send USDC, USDT or DAI to any wallet address across 180+ countries instantly.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Shield,
    title: "Non-Custodial",
    description:
      "Your keys, your money. We never hold your funds. Every transaction is on-chain.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: DollarSign,
    title: "Near-Zero Fees",
    description:
      "Skip the 3-7% international wire fees. Pay cents, not percentages.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect Wallet",
    description: "Connect MetaMask, Coinbase Wallet or any Web3 wallet.",
  },
  {
    step: "02",
    title: "Enter Recipient",
    description: "Paste the recipient's wallet address and choose a stablecoin.",
  },
  {
    step: "03",
    title: "Confirm & Send",
    description: "Review the transaction, approve it in your wallet. Done.",
  },
];

export default function HomePage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live on Ethereum, Polygon, Arbitrum, Base & Optimism
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight mb-6">
            Send Money
            <br />
            <span className="text-emerald-400">Across the World</span>
            <br />
            In Seconds.
          </h1>

          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            StableFlow lets you send USDC, USDT, and DAI internationally —
            instantly, cheaply, without banks or borders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => router.push("/send")}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl px-8 h-12 text-base"
            >
              Send Payment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl px-8 h-12 text-base"
            >
              View Dashboard
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative px-4 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-colors"
            >
              <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-3" />
              <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-white/40 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Why StableFlow?
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Built for the future of global payments — fast, cheap, and
              completely borderless.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`${f.bg} border ${f.border} rounded-2xl p-6 hover:scale-[1.01] transition-transform`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}
                >
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              How It Works
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Three steps and your money is on the other side of the world.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                  <span className="text-emerald-400 font-black text-4xl font-mono">
                    {step.step}
                  </span>
                  <h3 className="text-white font-bold text-lg mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 pb-32">
        <div className="max-w-3xl mx-auto text-center bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-12">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Ready to send your first payment?
          </h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Connect your wallet and send stablecoins anywhere in the world in
            under 10 seconds.
          </p>
          <Button
            onClick={() => router.push("/send")}
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl px-10 h-12 text-base"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}