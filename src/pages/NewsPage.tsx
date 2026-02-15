import React from 'react';

interface NewsItem {
    id: number;
    title: string;
    summary: string;
    image_url: string;
    category: string;
    date: string;
    source: string;
    url: string;
}

const MOCK_NEWS: NewsItem[] = [
    {
        id: 1,
        title: 'Bitcoin Surges Past $120K as Institutional Adoption Accelerates',
        summary:
            'Bitcoin has broken through the $120,000 barrier for the first time, driven by massive institutional inflows and the approval of several new spot ETFs across global markets.',
        image_url: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400&fit=crop',
        category: 'Bitcoin',
        date: '2026-01-15',
        source: 'CoinDesk',
        url: 'https://coindesk.com',
    },
    {
        id: 2,
        title: 'Ethereum Layer 2 Ecosystem Hits $80B TVL Milestone',
        summary:
            'The combined total value locked across Ethereum L2 solutions has surpassed $80 billion, with Arbitrum and Base leading the charge in DeFi activity.',
        image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
        category: 'DeFi',
        date: '2026-01-14',
        source: 'The Block',
        url: 'https://theblock.co',
    },
    {
        id: 3,
        title: 'EU Finalizes MiCA Phase 2: Stablecoin Regulations Take Effect',
        summary:
            'The European Union has officially enacted the second phase of its Markets in Crypto-Assets regulation, introducing stricter requirements for stablecoin issuers operating within the bloc.',
        image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop',
        category: 'Regulation',
        date: '2026-01-13',
        source: 'Reuters',
        url: 'https://reuters.com',
    },
    {
        id: 4,
        title: 'Solana Introduces Firedancer: Transaction Speeds Hit 1M TPS',
        summary:
            "Solana's highly anticipated Firedancer validator client is now live on mainnet, pushing the network's throughput to over one million transactions per second in benchmark tests.",
        image_url: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600&h=400&fit=crop',
        category: 'Technology',
        date: '2026-01-12',
        source: 'Decrypt',
        url: 'https://decrypt.co',
    },
    {
        id: 5,
        title: 'NFT Market Rebounds: AI-Generated Art Collections Lead Revival',
        summary:
            'After a prolonged downturn, the NFT market is experiencing a significant resurgence, with AI-assisted generative art collections driving record sales volumes on major marketplaces.',
        image_url: 'https://images.unsplash.com/photo-1646463535079-cabd0f1d7f80?w=600&h=400&fit=crop',
        category: 'NFTs',
        date: '2026-01-11',
        source: 'CoinTelegraph',
        url: 'https://cointelegraph.com',
    },
    {
        id: 6,
        title: 'Central Banks Explore Cross-Border CBDC Interoperability',
        summary:
            'A consortium of 15 central banks has successfully completed a pilot program for cross-border CBDC transactions, signaling a potential shift in international payment infrastructure.',
        image_url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&h=400&fit=crop',
        category: 'CBDC',
        date: '2026-01-10',
        source: 'Bloomberg',
        url: 'https://bloomberg.com',
    },
    {
        id: 7,
        title: 'DeFi Protocol Aave v4 Launches with Unified Liquidity Layer',
        summary:
            'Aave has launched its fourth major protocol version featuring a unified liquidity layer that allows seamless borrowing and lending across multiple chains without bridging.',
        image_url: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=600&h=400&fit=crop',
        category: 'DeFi',
        date: '2026-01-09',
        source: 'DeFi Pulse',
        url: 'https://defipulse.com',
    },
    {
        id: 8,
        title: 'BlackRock Tokenizes $10B Treasury Fund on Ethereum',
        summary:
            'Asset management giant BlackRock has completed the tokenization of a $10 billion treasury fund on Ethereum, marking the largest real-world asset tokenization to date.',
        image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
        category: 'RWA',
        date: '2026-01-08',
        source: 'Financial Times',
        url: 'https://ft.com',
    },
];

const CATEGORY_COLORS: Record<string, string> = {
    Bitcoin: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    DeFi: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Regulation: 'bg-red-500/20 text-red-400 border-red-500/30',
    Technology: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    NFTs: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    CBDC: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    RWA: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const NewsPage: React.FC = () => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mx-auto max-w-7xl mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Crypto{' '}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        News
                    </span>
                </h1>
                <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                    Latest market updates &amp; insights
                </p>
                <div className="mt-6 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
            </div>

            {/* News Grid */}
            <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {MOCK_NEWS.map((news) => (
                    <article
                        key={news.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-cyan-500/10 hover:shadow-2xl hover:border-cyan-500/30"
                    >
                        {/* Image */}
                        <div className="relative h-48 w-full overflow-hidden">
                            <img
                                src={news.image_url}
                                alt={news.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                            {/* Category Badge */}
                            <span
                                className={`absolute top-3 left-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                                    CATEGORY_COLORS[news.category] ?? 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                                }`}
                            >
                                {news.category}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-5">
                            {/* Meta */}
                            <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                                <span>{formatDate(news.date)}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-600" />
                                <span>{news.source}</span>
                            </div>

                            {/* Title */}
                            <h2 className="mb-2 text-lg font-bold leading-snug text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                                {news.title}
                            </h2>

                            {/* Summary */}
                            <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-400 line-clamp-3">
                                {news.summary}
                            </p>

                            {/* Read More */}
                            <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 self-start rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-all duration-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10"
                            >
                                Read More
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Hover glow effect */}
                        <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default NewsPage;