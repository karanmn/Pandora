"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock3,
  TrendingUp,
  TrendingDown,
  Info,
  Minus,
  Plus,
  RefreshCw,
  WalletCards,
  X,
  Activity,
  ShieldCheck,
} from "lucide-react";

/* =========================================================
   CONFIG & ROUND HORIZONS
========================================================= */

const HORIZONS = [
  { label: "30 Sec", short: "30s", duration: 30 },
  { label: "1 Min", short: "1m", duration: 60 },
  { label: "3 Min", short: "3m", duration: 180 },
  { label: "5 Min", short: "5m", duration: 300 },
];

const BASE_UNITS = [10, 50, 100, 500];
const MULTIPLIERS = [1, 2, 5, 10];
const PAGE_SIZE = 8;
const PERFORMANCE_BONUS_MULTIPLIER = 1.95; // 95% gain on accurate skill prediction

function getEpochRound(duration) {
  const now = new Date();
  const epoch = Math.floor(now.getTime() / 1000);
  const roundIndex = Math.floor(epoch / duration);
  const remaining = duration - (epoch % duration);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;
  const roundId = `${datePart}${String(roundIndex + 1).padStart(6, "0")}`;

  return { roundId, remaining, roundIndex };
}

export default function MarketSkillArenaPage() {
  const [horizonIndex, setHorizonIndex] = useState(0);
  const currentHorizon = HORIZONS[horizonIndex];

  // User State
  const [balance, setBalance] = useState(133.56);
  const [roundId, setRoundId] = useState("");
  const [remaining, setRemaining] = useState(currentHorizon.duration);

  // Live WebSocket Market Feed (Binance BTC/USDT)
  const [livePrice, setLivePrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);

  // Orders and Settlement
  const [pendingOrders, setPendingOrders] = useState([]);
  const [roundAudits, setRoundAudits] = useState([]);
  const [myHistory, setMyHistory] = useState([]);

  // Modal State
  const [orderModal, setOrderModal] = useState(null); // { direction: 'BULLISH' | 'BEARISH' }
  const [baseUnit, setBaseUnit] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [tab, setTab] = useState("audits");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");

  const previousRoundRef = useRef(null);
  const roundStrikePriceRef = useRef(null);

  const totalAllocation = useMemo(() => {
    return baseUnit * quantity * multiplier;
  }, [baseUnit, quantity, multiplier]);

  /* =========================================================
     1. CONNECT TO LIVE BINANCE WEBSOCKET FEED
  ========================================================= */
  useEffect(() => {
    let ws = null;
    let reconnectTimeout = null;

    const connectWebSocket = () => {
      ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");

      ws.onopen = () => {
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const current = parseFloat(data.c); // Last price
          setLivePrice(current);

          setPriceHistory((prev) => {
            const next = [current, ...prev.slice(0, 19)];
            return next;
          });
        } catch (e) {
          console.error("WS Parse Error", e);
        }
      };

      ws.onerror = () => {
        setWsConnected(false);
      };

      ws.onclose = () => {
        setWsConnected(false);
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  /* =========================================================
     2. LOAD PERSISTED LEDGER
  ========================================================= */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("pandora_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.balance !== undefined) setBalance(Number(u.balance));
      }

      const storedHistory = localStorage.getItem("pandora_market_history");
      if (storedHistory) {
        setMyHistory(JSON.parse(storedHistory));
      }
    } catch (e) {}
  }, []);

  const updateBalance = useCallback((val) => {
    const fixed = Number(val.toFixed(2));
    setBalance(fixed);
    try {
      const stored = localStorage.getItem("pandora_user");
      if (stored) {
        const u = JSON.parse(stored);
        u.balance = fixed;
        localStorage.setItem("pandora_user", JSON.stringify(u));
      }
    } catch (e) {}
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  /* =========================================================
     3. SETTLE ROUND AGAINST REAL BENCHMARK
  ========================================================= */
  const settleRound = useCallback(
    (expiredRoundId, strikePrice, finalClosingPrice, activeRoundOrders) => {
      if (!expiredRoundId || !strikePrice || !finalClosingPrice) return;

      const isBullish = finalClosingPrice >= strikePrice;
      const outcomeDirection = isBullish ? "BULLISH" : "BEARISH";
      const delta = (finalClosingPrice - strikePrice).toFixed(2);

      const auditRecord = {
        roundId: expiredRoundId,
        strikePrice: strikePrice.toFixed(2),
        closePrice: finalClosingPrice.toFixed(2),
        delta: Number(delta) >= 0 ? `+${delta}` : delta,
        outcome: outcomeDirection,
        timestamp: new Date().toLocaleTimeString(),
      };

      setRoundAudits((prev) => [auditRecord, ...prev.slice(0, 49)]);

      if (activeRoundOrders.length === 0) return;

      let netCredit = 0;
      const settledOrders = activeRoundOrders.map((order) => {
        const accuratePrediction = order.direction === outcomeDirection;

        if (accuratePrediction) {
          const payout = order.amount * PERFORMANCE_BONUS_MULTIPLIER;
          netCredit += payout;
          return {
            ...order,
            strikePrice,
            closePrice: finalClosingPrice,
            status: "SUCCESS",
            payout,
          };
        } else {
          return {
            ...order,
            strikePrice,
            closePrice: finalClosingPrice,
            status: "MISSED",
            payout: 0,
          };
        }
      });

      if (netCredit > 0) {
        updateBalance(balance + netCredit);
      }

      setMyHistory((prev) => {
        const updated = [...settledOrders, ...prev].slice(0, 100);
        try {
          localStorage.setItem("pandora_market_history", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      showToast(`Round ${expiredRoundId} closed: BTC ${outcomeDirection} (${auditRecord.delta} USD)`);
    },
    [balance, showToast, updateBalance]
  );

  /* =========================================================
     4. CENTRAL INTERVAL TICKER
  ========================================================= */
  useEffect(() => {
    let prev = previousRoundRef.current;

    const timer = setInterval(() => {
      const info = getEpochRound(currentHorizon.duration);
      setRoundId(info.roundId);
      setRemaining(info.remaining);

      // Lock strike price at round start
      if (!roundStrikePriceRef.current && livePrice) {
        roundStrikePriceRef.current = livePrice;
      }

      if (prev && prev !== info.roundId) {
        const finalClose = livePrice || roundStrikePriceRef.current;
        const strike = roundStrikePriceRef.current || finalClose;

        setPendingOrders((orders) => {
          const expired = orders.filter((o) => o.roundId === prev);
          settleRound(prev, strike, finalClose, expired);
          return orders.filter((o) => o.roundId !== prev);
        });

        // Reset strike for new round
        roundStrikePriceRef.current = livePrice;
      }

      prev = info.roundId;
      previousRoundRef.current = info.roundId;
    }, 500);

    return () => clearInterval(timer);
  }, [currentHorizon.duration, livePrice, settleRound]);

  /* =========================================================
     5. ORDER EXECUTION
  ========================================================= */
  const handleOpenOrder = (direction) => {
    if (remaining <= 5) {
      showToast("Order book closed for final 5-second market settlement.");
      return;
    }
    setOrderModal({ direction });
  };

  const handleConfirmOrder = () => {
    if (!orderModal || !livePrice) return;

    if (remaining <= 5) {
      showToast("Window locked for this epoch.");
      return;
    }

    if (totalAllocation > balance) {
      showToast("Insufficient demo allocation balance.");
      return;
    }

    const order = {
      id: `${Date.now()}-${Math.random()}`,
      roundId,
      direction: orderModal.direction,
      amount: totalAllocation,
      strikePrice: livePrice,
      timestamp: new Date().toLocaleTimeString(),
    };

    updateBalance(balance - totalAllocation);
    setPendingOrders((prev) => [...prev, order]);
    setOrderModal(null);
    showToast(`Allocated ₹${totalAllocation} on BTC ${orderModal.direction}`);
  };

  // Pagination
  const activeList = tab === "audits" ? roundAudits : myHistory;
  const totalPages = Math.max(1, Math.ceil(activeList.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleItems = activeList.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-[#0e1014] text-white select-none">
      <div className="mx-auto w-full max-w-md min-h-screen bg-[#14161d] relative pb-12 overflow-hidden border-x border-gray-800/60 shadow-2xl">
        {/* Header */}
        <header className="h-16 bg-[#181b24] px-4 flex items-center justify-between border-b border-gray-800 sticky top-0 z-40">
          <Link href="/user/select-panel" className="text-gray-400 hover:text-white">
            <ArrowLeft size={22} />
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-400" />
            <span className="font-extrabold text-sm tracking-wider uppercase text-yellow-500">
              BTC MARKET ARENA
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${wsConnected ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`} />
            <span className="text-[10px] text-gray-400 uppercase font-mono">{wsConnected ? "Live Feed" : "Connecting"}</span>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {/* Account Balance Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-[#202534] via-[#1c212e] to-[#161a24] p-5 border border-gray-800 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                  <WalletCards size={16} className="text-yellow-500" /> Paper Trading Balance
                </span>
                <div className="text-3xl font-black mt-1 text-white">₹{balance.toFixed(2)}</div>
              </div>
              <button onClick={() => updateBalance(1000)} className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-xl hover:bg-yellow-500/20 transition">
                Reset Demo
              </button>
            </div>
          </div>

          {/* Time Interval Selector */}
          <div className="grid grid-cols-4 gap-2">
            {HORIZONS.map((h, idx) => (
              <button
                key={h.label}
                onClick={() => {
                  setHorizonIndex(idx);
                  setOrderModal(null);
                }}
                className={`py-2.5 rounded-2xl border text-center transition flex flex-col items-center ${
                  horizonIndex === idx
                    ? "bg-[#252b3b] border-yellow-500 text-yellow-400 shadow-md shadow-yellow-500/10"
                    : "bg-[#181b24] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                <Clock3 size={15} className="mb-1" />
                <span className="text-xs font-extrabold">{h.label}</span>
              </button>
            ))}
          </div>

          {/* Live Binance Feed & Epoch Window */}
          <div className="bg-[#181b24] border border-gray-800 rounded-3xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">BINANCE BENCHMARK (BTC/USDT)</span>
                <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
                  ${livePrice ? livePrice.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "Loading..."}
                  <Activity size={18} className="text-teal-400 animate-bounce" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">Round Ends In</span>
                <div className={`text-2xl font-black font-mono ${remaining <= 5 ? "text-rose-500 animate-pulse" : "text-yellow-400"}`}>
                  {String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-800/80 text-[11px] text-gray-400 font-mono">
              <span>Epoch: {roundId || "Synchronizing"}</span>
              <span>Locked Strike: ${roundStrikePriceRef.current ? roundStrikePriceRef.current.toFixed(2) : "Calculating..."}</span>
            </div>
          </div>

          {/* Skill Order Direction Selection */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => handleOpenOrder("BULLISH")}
              disabled={remaining <= 5}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition"
            >
              <TrendingUp size={20} />
              PREDICT BULLISH (UP)
            </button>
            <button
              onClick={() => handleOpenOrder("BEARISH")}
              disabled={remaining <= 5}
              className="bg-rose-600 hover:bg-rose-500 active:scale-95 disabled:opacity-40 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 transition"
            >
              <TrendingDown size={20} />
              PREDICT BEARISH (DOWN)
            </button>
          </div>

          {/* History & Real Audits Tab */}
          <div className="pt-2">
            <div className="grid grid-cols-2 bg-[#181b24] p-1 rounded-2xl border border-gray-800 mb-3">
              <button
                onClick={() => { setTab("audits"); setPage(1); }}
                className={`py-2.5 text-xs font-bold rounded-xl transition ${tab === "audits" ? "bg-yellow-500 text-black shadow-md" : "text-gray-400"}`}
              >
                Epoch Settlement Audits
              </button>
              <button
                onClick={() => { setTab("orders"); setPage(1); }}
                className={`py-2.5 text-xs font-bold rounded-xl transition ${tab === "orders" ? "bg-yellow-500 text-black shadow-md" : "text-gray-400"}`}
              >
                My Prediction History
              </button>
            </div>

            <div className="bg-[#181b24] border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800/60">
              {tab === "audits" ? (
                visibleItems.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-500">Waiting for first epoch boundary close...</div>
                ) : (
                  visibleItems.map((item) => (
                    <div key={item.roundId} className="p-3.5 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-mono text-gray-300 font-bold">{item.roundId}</div>
                        <div className="text-[10px] text-gray-500">Close: ${item.closePrice} ({item.delta} USD)</div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold ${item.outcome === "BULLISH" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                          {item.outcome}
                        </span>
                        <span className="text-[10px] text-gray-500 block mt-0.5">{item.timestamp}</span>
                      </div>
                    </div>
                  ))
                )
              ) : (
                visibleItems.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-500">No predictions recorded yet.</div>
                ) : (
                  visibleItems.map((order) => (
                    <div key={order.id} className="p-3.5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-gray-200">BTC {order.direction}</span>
                        <div className="text-[10px] text-gray-500">Allocated: ₹{order.amount} • Round {order.roundId}</div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${order.status === "SUCCESS" ? "text-emerald-400" : "text-rose-400"}`}>
                          {order.status === "SUCCESS" ? `+₹${order.payout.toFixed(2)}` : "MISSED"}
                        </span>
                        <span className="text-[10px] text-gray-500 block">{order.timestamp}</span>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>

            {/* Pagination Controls */}
            <div className="mt-3 flex justify-between items-center text-xs px-2 text-gray-400">
              <button disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)} className="p-2 bg-[#181b24] border border-gray-800 rounded-xl disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              <span>Page {safePage} of {totalPages}</span>
              <button disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)} className="p-2 bg-[#181b24] border border-gray-800 rounded-xl disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 5-SECOND COUNTDOWN LOCK OVERLAY */}
        {remaining <= 5 && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 mb-4">
              Window Locked • Resolving with Live Binance Feed
            </span>
            <div className="w-28 h-36 bg-gradient-to-b from-[#f5a623] to-[#c48215] text-black font-mono font-black text-8xl rounded-3xl flex items-center justify-center shadow-2xl border-4 border-yellow-200">
              {remaining}
            </div>
          </div>
        )}

        {/* ORDER EXECUTION MODAL */}
        {orderModal && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-[#181b24] rounded-t-3xl p-5 border-t border-gray-700 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Target:</span>
                  <span className={`font-black text-sm ${orderModal.direction === "BULLISH" ? "text-emerald-400" : "text-rose-400"}`}>
                    BTC {orderModal.direction} ({currentHorizon.label})
                  </span>
                </div>
                <button onClick={() => setOrderModal(null)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Base Unit Selector */}
              <div>
                <span className="text-[11px] text-gray-400 block mb-1.5">Base Allocation</span>
                <div className="grid grid-cols-4 gap-2">
                  {BASE_UNITS.map((u) => (
                    <button
                      key={u}
                      onClick={() => setBaseUnit(u)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        baseUnit === u ? "bg-yellow-500 text-black border-yellow-500" : "bg-[#12141a] border-gray-800 text-gray-300"
                      }`}
                    >
                      ₹{u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Quantity</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-xl bg-gray-800 text-white flex items-center justify-center">
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-sm w-12 text-center">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="w-9 h-9 rounded-xl bg-gray-800 text-white flex items-center justify-center">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Multiplier */}
              <div>
                <span className="text-[11px] text-gray-400 block mb-1.5">Scale Multiplier</span>
                <div className="grid grid-cols-4 gap-2">
                  {MULTIPLIERS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMultiplier(m)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                        multiplier === m ? "bg-yellow-500 text-black border-yellow-500" : "bg-[#12141a] border-gray-800 text-gray-400"
                      }`}
                    >
                      X{m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => setOrderModal(null)} className="py-3 rounded-xl bg-gray-800 text-xs font-bold">
                  Cancel
                </button>
                <button onClick={handleConfirmOrder} className="py-3 rounded-xl bg-yellow-500 text-black text-xs font-extrabold hover:bg-yellow-400 transition">
                  Confirm ₹{totalAllocation}.00
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Toast */}
        {toast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-black/90 text-white px-5 py-3 rounded-xl text-xs shadow-2xl border border-gray-800">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}
