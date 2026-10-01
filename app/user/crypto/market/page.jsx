"use client";
import { useEffect, useState } from "react";
import BottomNav from "@/app/components/BottomNav";

export default function MarketPage() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Binance Real Free Public API
  useEffect(() => {
    async function fetchCrypto() {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        const data = await res.json();
        const targets = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "SOLUSDT", "TRXUSDT"];
        const filtered = data
          .filter((item) => targets.includes(item.symbol))
          .map((item) => ({
            name: item.symbol.replace("USDT", ""),
            pair: `${item.symbol.replace("USDT", "")}/USDT`,
            price: parseFloat(item.lastPrice).toLocaleString(),
            fullPrice: `$${parseFloat(item.lastPrice).toFixed(4)}`,
            chg: `${parseFloat(item.priceChangePercent) >= 0 ? "+" : ""}${parseFloat(item.priceChangePercent).toFixed(2)}%`,
            down: parseFloat(item.priceChangePercent) < 0,
          }));
        setCryptos(filtered);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchCrypto();
    const interval = setInterval(fetchCrypto, 5000); // 5 sec live refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      {/* Top Banner Ticker */}
      <div className="p-3 bg-[#13151b] border-b border-gray-800 text-xs flex justify-between overflow-x-auto whitespace-nowrap gap-4">
        <div>
          <span className="text-[#f5a623] font-bold">BTCUSDT</span> <span className="font-semibold">83,252.01</span>{" "}
          <span className="text-red-400">-0.49%</span>
        </div>
        <div>
          <span className="text-teal-400 font-bold">ETHUSDT</span> <span className="font-semibold">2,678.82</span>{" "}
          <span className="text-green-400">+0.03%</span>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xs font-bold text-[#f5a623] uppercase tracking-wider mb-3">Trending Markets</h2>

        {loading ? (
          <div className="p-6 text-center text-xs text-gray-500">Loading Live Prices...</div>
        ) : (
          <div className="bg-[#16181f] border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800/60">
            <div className="p-3 bg-[#111317] text-[10px] text-gray-500 font-semibold grid grid-cols-3">
              <span>Name</span>
              <span className="text-center">Last Price</span>
              <span className="text-right">24h chg%</span>
            </div>

            {cryptos.map((coin) => (
              <div key={coin.pair} className="p-3.5 grid grid-cols-3 items-center">
                <div>
                  <div className="font-bold text-sm text-gray-100">{coin.name}</div>
                  <div className="text-[10px] text-gray-500">{coin.pair}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xs text-gray-200">{coin.price}</div>
                  <div className="text-[9px] text-gray-500">{coin.fullPrice}</div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-bold px-2 py-1 rounded-md min-w-[65px] text-center ${
                      coin.down ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {coin.chg}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
