import { useState, useEffect, useCallback } from "react";
import { z } from "zod";

// --- Types ---
interface Asset {
    id: string;
    amount: number;
}

interface PriceData {
    [key: string]: {
        usd: number;
        usd_24h_change?: number;
    };
}

// --- Zod Schema ---
const assetSchema = z.object({
    id: z.string().min(1, "Asset ID is required"),
    amount: z
        .number({ error: "Amount must be a number" })
        .positive("Amount must be a positive number"),
});

// --- LocalStorage key ---
const STORAGE_KEY = "crypto_assets" as const;

// --- Zod schema for stored assets (guard against tampered data) ---
const storedAssetsSchema = z.array(assetSchema);

function loadAssets(): Asset[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = storedAssetsSchema.safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : [];
    } catch {
        return [];
    }
}

function saveAssets(assets: Asset[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
}

// --- Popular coins for the dropdown ---
const POPULAR_COINS = [
    { id: "bitcoin", label: "Bitcoin (BTC)" },
    { id: "ethereum", label: "Ethereum (ETH)" },
    { id: "solana", label: "Solana (SOL)" },
    { id: "cardano", label: "Cardano (ADA)" },
    { id: "ripple", label: "XRP (XRP)" },
    { id: "polkadot", label: "Polkadot (DOT)" },
    { id: "dogecoin", label: "Dogecoin (DOGE)" },
    { id: "avalanche-2", label: "Avalanche (AVAX)" },
    { id: "chainlink", label: "Chainlink (LINK)" },
    { id: "litecoin", label: "Litecoin (LTC)" },
];

export default function PortfolioPage() {
    const [assets, setAssets] = useState<Asset[]>(loadAssets);
    const [prices, setPrices] = useState<PriceData>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Form state
    const [selectedCoin, setSelectedCoin] = useState(POPULAR_COINS[0].id);
    const [amountInput, setAmountInput] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    // --- Fetch Prices ---
    const fetchPrices = useCallback(async (assetIds: string[]) => {
        if (assetIds.length === 0) {
            setPrices({});
            return;
        }
        setLoading(true);
        setApiError(null);
        try {
            const ids = assetIds.join(",");
            const res = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
            );
            if (!res.ok) {
                throw new Error(`API responded with status ${res.status}`);
            }
            const data: PriceData = await res.json();
            setPrices(data);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to fetch prices";
            setApiError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Persist assets to localStorage whenever they change
    useEffect(() => {
        saveAssets(assets);
    }, [assets]);

    useEffect(() => {
        const ids = [...new Set(assets.map((a) => a.id))];
        fetchPrices(ids);
        const interval = setInterval(() => fetchPrices(ids), 60_000);
        return () => clearInterval(interval);
    }, [assets, fetchPrices]);

    // --- Handlers ---
    const handleAddAsset = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const parsed = assetSchema.safeParse({
            id: selectedCoin,
            amount: parseFloat(amountInput),
        });

        if (!parsed.success) {
            setFormError(parsed.error.issues[0].message);
            return;
        }

        const existing = assets.find((a) => a.id === parsed.data.id);
        if (existing) {
            setAssets((prev) =>
                prev.map((a) =>
                    a.id === parsed.data.id
                        ? { ...a, amount: a.amount + parsed.data.amount }
                        : a
                )
            );
        } else {
            setAssets((prev) => [...prev, parsed.data]);
        }

        setAmountInput("");
    };

    const handleRemoveAsset = (id: string) => {
        setAssets((prev) => prev.filter((a) => a.id !== id));
    };

    // --- Computed ---
    const totalValue = assets.reduce((sum, asset) => {
        const price = prices[asset.id]?.usd ?? 0;
        return sum + price * asset.amount;
    }, 0);

    const getCoinLabel = (id: string) =>
        POPULAR_COINS.find((c) => c.id === id)?.label ?? id;

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);

    const formatChange = (change?: number) => {
        if (change == null) return null;
        const isPositive = change >= 0;
        return (
            <span className={isPositive ? "text-emerald-400" : "text-red-400"}>
                {isPositive ? "+" : ""}
                {change.toFixed(2)}%
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8">
            {/* Header */}
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">
                        Portfolio
                    </h1>
                    <p className="mt-1 text-slate-400">
                        Track your crypto assets in real time
                    </p>
                </div>

                {/* Total Portfolio Value */}
                <div className="mb-8 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl">
                    <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
                        Total Portfolio Value
                    </p>
                    <p className="mt-1 text-4xl font-bold text-white">
                        {loading && assets.length > 0 && Object.keys(prices).length === 0
                            ? "Loading..."
                            : formatCurrency(totalValue)}
                    </p>
                    {apiError && (
                        <p className="mt-2 text-sm text-red-400">⚠ {apiError}</p>
                    )}
                </div>

                {/* Bento Grid */}
                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Left Column — Add Asset Form */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl">
                            <h2 className="mb-4 text-lg font-semibold text-white">
                                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                                Add Asset
                            </h2>

                            <form onSubmit={handleAddAsset} className="space-y-4">
                                {/* Coin Select */}
                                <div>
                                    <label
                                        htmlFor="coin-select"
                                        className="mb-1 block text-sm font-medium text-slate-300"
                                    >
                                        Coin
                                    </label>
                                    <select
                                        id="coin-select"
                                        value={selectedCoin}
                                        onChange={(e) => setSelectedCoin(e.target.value)}
                                        className="w-full rounded-lg border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    >
                                        {POPULAR_COINS.map((coin) => (
                                            <option key={coin.id} value={coin.id}>
                                                {coin.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Amount Input */}
                                <div>
                                    <label
                                        htmlFor="amount-input"
                                        className="mb-1 block text-sm font-medium text-slate-300"
                                    >
                                        Amount
                                    </label>
                                    <input
                                        id="amount-input"
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="e.g. 1.5"
                                        value={amountInput}
                                        onChange={(e) => {
                                            setAmountInput(e.target.value);
                                            setFormError(null);
                                        }}
                                        className="w-full rounded-lg border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>

                                {/* Form Error */}
                                {formError && (
                                    <p className="text-sm text-red-400">{formError}</p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-500 active:scale-[0.98]"
                                >
                                    Add to Portfolio
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column — Assets List */}
                    <div className="lg:col-span-3">
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl">
                            <h2 className="mb-4 text-lg font-semibold text-white">
                                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                                My Assets
                            </h2>

                            {assets.length === 0 ? (
                                <p className="py-12 text-center text-slate-500">
                                    No assets yet. Add one to get started!
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-700/50 text-xs font-medium uppercase tracking-wider text-slate-400">
                                                <th className="pb-3 pr-4">Asset</th>
                                                <th className="pb-3 pr-4">Amount</th>
                                                <th className="pb-3 pr-4">Price</th>
                                                <th className="pb-3 pr-4">24h</th>
                                                <th className="pb-3 pr-4 text-right">Value</th>
                                                <th className="pb-3" />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assets.map((asset) => {
                                                const priceData = prices[asset.id];
                                                const price = priceData?.usd ?? 0;
                                                const value = price * asset.amount;
                                                const change = priceData?.usd_24h_change;
                                                const allocationPct =
                                                    totalValue > 0
                                                        ? ((value / totalValue) * 100).toFixed(1)
                                                        : "0.0";

                                                return (
                                                    <tr
                                                        key={asset.id}
                                                        className="border-b border-slate-700/30 transition hover:bg-slate-700/20"
                                                    >
                                                        <td className="py-4 pr-4">
                                                            <div>
                                                                <p className="font-medium text-white">
                                                                    {getCoinLabel(asset.id)}
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {allocationPct}% of portfolio
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 pr-4 text-slate-300">
                                                            {asset.amount}
                                                        </td>
                                                        <td className="py-4 pr-4 text-slate-300">
                                                            {loading && !priceData
                                                                ? "..."
                                                                : formatCurrency(price)}
                                                        </td>
                                                        <td className="py-4 pr-4 text-sm">
                                                            {loading && !priceData
                                                                ? "..."
                                                                : formatChange(change)}
                                                        </td>
                                                        <td className="py-4 pr-4 text-right font-semibold text-white">
                                                            {loading && !priceData
                                                                ? "..."
                                                                : formatCurrency(value)}
                                                        </td>
                                                        <td className="py-4">
                                                            <button
                                                                onClick={() => handleRemoveAsset(asset.id)}
                                                                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                                                                title="Remove asset"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Footer info */}
                            {assets.length > 0 && (
                                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                    <span>{assets.length} asset(s)</span>
                                    <span>
                                        {loading ? "Updating..." : "Auto-refreshes every 60s"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}