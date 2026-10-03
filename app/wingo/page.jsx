"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  X,
  AlertCircle,
  Trophy,
  Clock3,
} from "lucide-react";

const WIN_GO_MODES = [
  { label: "30 Sec", duration: 30 },
  { label: "1 Min", duration: 60 },
  { label: "3 Min", duration: 180 },
  { label: "5 Min", duration: 300 },
];

const MULTIPLIERS = [1, 5, 10, 20, 50, 100];
const BASE_AMOUNTS = [1, 10, 100, 1000];

/*
  DEMO / VIRTUAL MONEY PAYOUTS

  These are intentionally kept in the client for this demo.
  A real-money implementation should NOT trust client-side
  result generation or wallet settlement.
*/
const PAYOUTS = {
  Green: 2,
  Red: 2,
  Violet: 4.5,
  Big: 2,
  Small: 2,
  Number: 9,
};

const WINNING_FEE_RATE = 0.003; // 0.3%

function getNumberColor(number) {
  if (number === 0 || number === 5) return "Violet";
  return number % 2 === 0 ? "Red" : "Green";
}

function getColorClass(color) {
  if (color === "Green") return "bg-emerald-500";
  if (color === "Red") return "bg-rose-500";
  return "bg-purple-500";
}

function getBigSmall(number) {
  return number >= 5 ? "Big" : "Small";
}

function getLocalDatePart(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

function getRoundInfo(duration) {
  const now = new Date();

  const epochSeconds = Math.floor(now.getTime() / 1000);

  const roundIndex = Math.floor(epochSeconds / duration);

  const nextRoundSeconds =
    (roundIndex + 1) * duration - epochSeconds;

  const periodId =
    getLocalDatePart(now) +
    String(roundIndex + 1).padStart(6, "0");

  return {
    periodId,
    secondsRemaining: nextRoundSeconds,
  };
}

function generateRandomNumber() {
  /*
    Uniform random number 0-9.

    For a demo game this is sufficient.
    For any real-money system, this must be generated
    and verified server-side.
  */
  return Math.floor(Math.random() * 10);
}

export default function WinGoGamePage() {
  const [activeModeIndex, setActiveModeIndex] = useState(0);

  const [balance, setBalance] = useState(133.56);

  const [secondsRemaining, setSecondsRemaining] = useState(30);

  const [periodId, setPeriodId] = useState("");

  const [currentResult, setCurrentResult] = useState(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [betSelection, setBetSelection] = useState(null);

  const [betType, setBetType] = useState("");

  const [baseUnit, setBaseUnit] = useState(10);

  const [multiplier, setMultiplier] = useState(1);

  const [errorMsg, setErrorMsg] = useState("");

  const [successToast, setSuccessToast] = useState("");

  const [resultToast, setResultToast] = useState("");

  const [pendingBets, setPendingBets] = useState([]);

  const [historyData, setHistoryData] = useState([]);

  const [lastSettledPeriod, setLastSettledPeriod] = useState(null);

  const initializedRef = useRef(false);

  const previousPeriodRef = useRef(null);

  const currentDuration =
    WIN_GO_MODES[activeModeIndex].duration;

  const totalBetAmount =
    baseUnit * multiplier;

  const isLocked =
    secondsRemaining <= 5;

  /*
    -----------------------------------------
    LOAD DEMO GAME DATA
    -----------------------------------------
  */

  useEffect(() => {
    const storedUser =
      localStorage.getItem("pandora_user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        if (parsed.balance !== undefined) {
          const parsedBalance =
            parseFloat(parsed.balance);

          if (!Number.isNaN(parsedBalance)) {
            setBalance(parsedBalance);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    const storedHistory =
      localStorage.getItem("wingo_demo_history");

    if (storedHistory) {
      try {
        const parsed =
          JSON.parse(storedHistory);

        if (Array.isArray(parsed)) {
          setHistoryData(parsed);
        }
      } catch (error) {
        console.error(error);
      }
    }

    initializedRef.current = true;
  }, []);

  /*
    -----------------------------------------
    SAVE BALANCE
    -----------------------------------------
  */

  const saveBalance = useCallback((newBalance) => {
    setBalance(newBalance);

    const stored =
      localStorage.getItem("pandora_user");

    if (stored) {
      try {
        const parsed =
          JSON.parse(stored);

        parsed.balance = newBalance;

        localStorage.setItem(
          "pandora_user",
          JSON.stringify(parsed)
        );
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  /*
    -----------------------------------------
    SAVE HISTORY
    -----------------------------------------
  */

  const saveHistory = useCallback((newHistory) => {
    setHistoryData(newHistory);

    localStorage.setItem(
      "wingo_demo_history",
      JSON.stringify(newHistory)
    );
  }, []);

  /*
    -----------------------------------------
    SETTLE ROUND
    -----------------------------------------
  */

  const settleRound = useCallback(
    (settledPeriod, bets) => {
      if (!settledPeriod || !bets.length) {
        return;
      }

      /*
        Generate ONE result for the entire round.

        Every bet in this period receives the
        exact same result.
      */
      const resultNumber =
        generateRandomNumber();

      const resultColor =
        getNumberColor(resultNumber);

      const resultSize =
        getBigSmall(resultNumber);

      const result = {
        period: settledPeriod,
        number: resultNumber,
        color: resultColor,
        bigSmall: resultSize,
        timestamp: Date.now(),
      };

      setCurrentResult(result);
      setLastSettledPeriod(settledPeriod);

      let balanceChange = 0;

      const settledBets = bets.map((bet) => {
        let won = false;

        if (bet.type === "Number") {
          won =
            Number(bet.selection) === resultNumber;
        }

        if (bet.type === "Color") {
          won =
            bet.selection === resultColor;
        }

        if (bet.type === "Size") {
          won =
            bet.selection === resultSize;
        }

        if (!won) {
          return {
            ...bet,
            resultNumber,
            resultColor,
            resultSize,
            status: "LOSS",
            payout: 0,
            fee: 0,
            returned: 0,
          };
        }

        const grossPayout =
          bet.amount *
          PAYOUTS[bet.type];

        /*
          0.3% deduction from winning payout.
        */
        const fee =
          grossPayout *
          WINNING_FEE_RATE;

        const netPayout =
          grossPayout - fee;

        /*
          Stake was already removed when the
          bet was placed.

          Therefore only the payout is added now.
        */
        balanceChange += netPayout;

        return {
          ...bet,
          resultNumber,
          resultColor,
          resultSize,
          status: "WIN",
          payout: grossPayout,
          fee,
          returned: netPayout,
        };
      });

      if (balanceChange !== 0) {
        const newBalance =
          parseFloat(
            (balance + balanceChange).toFixed(2)
          );

        saveBalance(newBalance);
      }

      /*
        Add actual result to game history.
      */
      const historyItem = {
        period: settledPeriod,
        number: resultNumber,
        bigSmall: resultSize,
        color: getColorClass(resultColor),
        colorName: resultColor,
      };

      setHistoryData((previous) => {
        const updated = [
          historyItem,
          ...previous.filter(
            (item) =>
              item.period !== settledPeriod
          ),
        ].slice(0, 20);

        localStorage.setItem(
          "wingo_demo_history",
          JSON.stringify(updated)
        );

        return updated;
      });

      /*
        Show result notification.
      */
      const wins =
        settledBets.filter(
          (bet) => bet.status === "WIN"
        ).length;

      const losses =
        settledBets.filter(
          (bet) => bet.status === "LOSS"
        ).length;

      if (wins > 0) {
        setResultToast(
          `Result ${resultNumber} • ${resultColor} • ${resultSize} • ${wins} WIN`
        );
      } else {
        setResultToast(
          `Result ${resultNumber} • ${resultColor} • ${resultSize} • ${losses} LOSS`
        );
      }

      setTimeout(() => {
        setResultToast("");
      }, 5000);

      /*
        Clear bets because this round has settled.
      */
      setPendingBets([]);

      return {
        result,
        settledBets,
      };
    },
    [balance, saveBalance]
  );

  /*
    -----------------------------------------
    CLOCK + ROUND DETECTION
    -----------------------------------------
  */

  useEffect(() => {
    const updateClock = () => {
      const info =
        getRoundInfo(currentDuration);

      setSecondsRemaining(
        info.secondsRemaining
      );

      setPeriodId(info.periodId);

      /*
        Detect transition from previous round
        to a new round.
      */
      if (
        initializedRef.current &&
        previousPeriodRef.current &&
        previousPeriodRef.current !==
          info.periodId
      ) {
        setPendingBets((currentBets) => {
          if (currentBets.length > 0) {
            settleRound(
              previousPeriodRef.current,
              currentBets
            );
          }

          return currentBets;
        });
      }

      previousPeriodRef.current =
        info.periodId;
    };

    updateClock();

    const timer =
      setInterval(updateClock, 250);

    return () => clearInterval(timer);
  }, [
    currentDuration,
    settleRound,
  ]);

  /*
    -----------------------------------------
    FORMAT TIMER
    -----------------------------------------
  */

  const formatTime = (totalSec) => {
    const minutes =
      Math.floor(totalSec / 60);

    const seconds =
      totalSec % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )} : ${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  /*
    -----------------------------------------
    OPEN BETTING SHEET
    -----------------------------------------
  */

  const handleOpenSheet = (
    type,
    value
  ) => {
    if (isLocked) {
      setErrorMsg(
        "Round is locked for the last 5 seconds!"
      );

      setTimeout(
        () => setErrorMsg(""),
        2500
      );

      return;
    }

    setBetType(type);
    setBetSelection(value);
    setIsSheetOpen(true);
  };

  /*
    -----------------------------------------
    PLACE BET
    -----------------------------------------
  */

  const handleConfirmBet = () => {
    if (isLocked) {
      setErrorMsg(
        "Time expired! Cannot place order now."
      );

      return;
    }

    if (!periodId) {
      setErrorMsg(
        "Round is not ready yet."
      );

      return;
    }

    if (balance < totalBetAmount) {
      setErrorMsg(
        "Insufficient virtual balance!"
      );

      return;
    }

    /*
      IMPORTANT:
      Deduct stake immediately.

      If bet loses:
        nothing is returned.

      If bet wins:
        payout is added after settlement.
    */
    const newBalance =
      parseFloat(
        (
          balance -
          totalBetAmount
        ).toFixed(2)
      );

    saveBalance(newBalance);

    const newBet = {
      id:
        `${Date.now()}-${Math.random()}`,

      period: periodId,

      type: betType,

      selection: betSelection,

      amount: totalBetAmount,

      multiplier: multiplier,

      placedAt: Date.now(),
    };

    setPendingBets((previous) => [
      ...previous,
      newBet,
    ]);

    setIsSheetOpen(false);

    setSuccessToast(
      `₹${totalBetAmount.toFixed(
        2
      )} placed on ${betSelection}`
    );

    setTimeout(
      () => setSuccessToast(""),
      3000
    );
  };

  /*
    -----------------------------------------
    CHANGE GAME MODE
    -----------------------------------------
  */

  const changeMode = (index) => {
    setActiveModeIndex(index);

    setIsSheetOpen(false);

    /*
      Reset current round state because
      each mode has a different clock.
    */
    previousPeriodRef.current = null;

    setPendingBets([]);

    setCurrentResult(null);
  };

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-12 max-w-md mx-auto relative font-sans select-none">

      {/* HEADER */}

      <header className="sticky top-0 z-40 bg-[#16181f]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-800">

        <Link
          href="/user/select-panel"
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>

        <span className="font-extrabold text-sm tracking-widest uppercase text-[#f5a623]">
          PANDORA PLAY
        </span>

        <div className="w-5" />

      </header>

      <div className="p-4 space-y-4">

        {/* WALLET */}

        <div className="bg-gradient-to-r from-[#d4a046] via-[#c49237] to-[#a37220] text-black p-4 rounded-2xl shadow-xl">

          <div className="flex items-center justify-between">

            <span className="text-xs font-bold flex items-center gap-1.5 opacity-90">

              <Wallet size={15} />

              Virtual Wallet

            </span>

            <span className="text-[10px] uppercase font-bold tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
              DEMO
            </span>

          </div>

          <div className="text-3xl font-black my-2 tracking-tight">
            ₹{balance.toFixed(2)}
          </div>

          <div className="text-[10px] opacity-70">
            Virtual/demo balance only
          </div>

        </div>

        {/* MODES */}

        <div className="grid grid-cols-4 gap-2">

          {WIN_GO_MODES.map(
            (mode, idx) => {

              const selected =
                activeModeIndex === idx;

              return (
                <button
                  key={mode.label}
                  onClick={() =>
                    changeMode(idx)
                  }
                  className={`py-2.5 px-1 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                    selected
                      ? "bg-[#1f222b] border-[#f5a623] text-[#f5a623]"
                      : "bg-[#16181f] border-gray-800 text-gray-400"
                  }`}
                >
                  <span className="text-xs font-extrabold">
                    Win Go
                  </span>

                  <span className="text-[10px]">
                    {mode.label}
                  </span>
                </button>
              );
            }
          )}

        </div>

        {/* ROUND CARD */}

        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4">

          <div className="flex justify-between items-center">

            <div>

              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                Current Period
              </span>

              <div className="text-xs font-mono font-bold">
                {periodId || "..."}
              </div>

            </div>

            <div className="text-right">

              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                Time Remaining
              </span>

              <div
                className={`text-2xl font-mono font-black ${
                  isLocked
                    ? "text-rose-500 animate-pulse"
                    : "text-[#f5a623]"
                }`}
              >
                {formatTime(
                  secondsRemaining
                )}
              </div>

            </div>

          </div>

        </div>

        {/* LAST RESULT */}

        {currentResult && (
          <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4">

            <div className="flex items-center justify-between mb-3">

              <span className="text-xs font-bold">
                Last Result
              </span>

              <Trophy
                size={16}
                className="text-[#f5a623]"
              />

            </div>

            <div className="flex items-center justify-between">

              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${getColorClass(
                  currentResult.color
                )}`}
              >
                {currentResult.number}
              </div>

              <div className="text-right">

                <div className="text-sm font-bold">
                  {currentResult.color}
                </div>

                <div className="text-xs text-gray-400">
                  {currentResult.bigSmall}
                </div>

                <div className="text-[10px] text-gray-500 mt-1">
                  Period{" "}
                  {currentResult.period}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* COLORS */}

        <div className="grid grid-cols-3 gap-3">

          <button
            disabled={isLocked}
            onClick={() =>
              handleOpenSheet(
                "Color",
                "Green"
              )
            }
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 py-3 rounded-2xl font-bold text-sm"
          >
            Green
          </button>

          <button
            disabled={isLocked}
            onClick={() =>
              handleOpenSheet(
                "Color",
                "Violet"
              )
            }
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 py-3 rounded-2xl font-bold text-sm"
          >
            Violet
          </button>

          <button
            disabled={isLocked}
            onClick={() =>
              handleOpenSheet(
                "Color",
                "Red"
              )
            }
            className="bg-rose-600 hover:bg-rose-500 disabled:opacity-40 py-3 rounded-2xl font-bold text-sm"
          >
            Red
          </button>

        </div>

        {/* NUMBERS */}

        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-3.5">

          <div className="grid grid-cols-5 gap-2.5">

            {[0,1,2,3,4,5,6,7,8,9].map(
              (num) => {

                const color =
                  getNumberColor(num);

                return (
                  <button
                    key={num}
                    disabled={isLocked}
                    onClick={() =>
                      handleOpenSheet(
                        "Number",
                        num
                      )
                    }
                    className={`h-11 rounded-full font-black text-sm flex items-center justify-center border shadow-md active:scale-95 transition disabled:opacity-40 ${
                      color === "Violet"
                        ? "bg-purple-600 border-purple-400"
                        : color === "Red"
                        ? "bg-rose-600 border-rose-400"
                        : "bg-emerald-600 border-emerald-400"
                    }`}
                  >
                    {num}
                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* BIG SMALL */}

        <div className="grid grid-cols-2 gap-3">

          <button
            disabled={isLocked}
            onClick={() =>
              handleOpenSheet(
                "Size",
                "Big"
              )
            }
            className="bg-[#f5a623] disabled:opacity-40 text-black font-extrabold py-3 rounded-2xl text-sm"
          >
            Big
          </button>

          <button
            disabled={isLocked}
            onClick={() =>
              handleOpenSheet(
                "Size",
                "Small"
              )
            }
            className="bg-sky-600 disabled:opacity-40 font-extrabold py-3 rounded-2xl text-sm"
          >
            Small
          </button>

        </div>

        {/* CURRENT BETS */}

        {pendingBets.length > 0 && (
          <div className="bg-[#16181f] border border-gray-800 rounded-2xl overflow-hidden">

            <div className="px-4 py-3 border-b border-gray-800">

              <div className="flex justify-between">

                <span className="text-xs font-bold">
                  Current Bets
                </span>

                <span className="text-[10px] text-gray-500">
                  {pendingBets.length} bet
                  {pendingBets.length > 1
                    ? "s"
                    : ""}
                </span>

              </div>

            </div>

            <div className="divide-y divide-gray-800">

              {pendingBets.map(
                (bet) => (
                  <div
                    key={bet.id}
                    className="px-4 py-3 flex items-center justify-between"
                  >

                    <div>

                      <div className="text-xs font-bold">
                        {bet.selection}
                      </div>

                      <div className="text-[10px] text-gray-500">
                        {bet.type} • ₹
                        {bet.amount}
                      </div>

                    </div>

                    <span className="text-[10px] text-[#f5a623] font-bold">
                      Pending
                    </span>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* GAME RECORD */}

        <div className="bg-[#16181f] border border-gray-800 rounded-2xl overflow-hidden">

          <div className="px-4 py-3 border-b border-gray-800 flex justify-between">

            <span className="text-xs font-bold">
              Game Record
            </span>

            <span className="text-[10px] text-gray-500">
              {WIN_GO_MODES[
                activeModeIndex
              ].label}
            </span>

          </div>

          <div className="divide-y divide-gray-800/60">

            {historyData.length === 0 ? (

              <div className="px-4 py-8 text-center text-xs text-gray-500">
                Results will appear here after the first round.
              </div>

            ) : (

              historyData.map(
                (item) => (

                  <div
                    key={item.period}
                    className="px-4 py-2.5 flex items-center justify-between text-xs"
                  >

                    <span className="text-gray-400 font-mono text-[10px]">
                      {item.period}
                    </span>

                    <span
                      className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center font-black text-white`}
                    >
                      {item.number}
                    </span>

                    <span className="text-gray-300">
                      {item.bigSmall}
                    </span>

                    <span className="text-[10px] text-gray-500">
                      {item.colorName}
                    </span>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>

      {/* LOCK OVERLAY */}

      {isLocked && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center">

          <div className="text-center">

            <Clock3
              size={30}
              className="mx-auto text-[#f5a623] mb-4"
            />

            <div className="flex gap-3">

              <div className="w-20 h-28 bg-gradient-to-b from-[#d4a046] to-[#a37220] text-black font-mono font-black text-6xl rounded-3xl flex items-center justify-center">
                {String(
                  Math.floor(
                    secondsRemaining / 10
                  )
                )}
              </div>

              <div className="w-20 h-28 bg-gradient-to-b from-[#d4a046] to-[#a37220] text-black font-mono font-black text-6xl rounded-3xl flex items-center justify-center">
                {String(
                  secondsRemaining % 10
                )}
              </div>

            </div>

            <div className="text-xs text-gray-400 mt-4">
              Round locked
            </div>

          </div>

        </div>
      )}

      {/* ERROR */}

      {errorMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] bg-rose-600 text-white text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">

          <AlertCircle size={15} />

          {errorMsg}

        </div>
      )}

      {/* BET SUCCESS */}

      {successToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl font-bold shadow-lg">
          {successToast}
        </div>
      )}

      {/* RESULT TOAST */}

      {resultToast && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[70] bg-[#f5a623] text-black px-5 py-3 rounded-2xl font-black text-xs shadow-2xl text-center">
          {resultToast}
        </div>
      )}

      {/* BETTING SHEET */}

      {isSheetOpen && (

        <div className="fixed inset-0 bg-black/70 z-[60] flex items-end justify-center">

          <div className="w-full max-w-md bg-[#16181f] rounded-t-3xl p-5 border-t border-gray-700 space-y-4">

            <div className="flex justify-between items-center pb-2 border-b border-gray-800">

              <div>

                <div className="font-bold text-sm text-[#f5a623]">
                  Win Go{" "}
                  {
                    WIN_GO_MODES[
                      activeModeIndex
                    ].label
                  }
                </div>

                <div className="text-[10px] text-gray-400 mt-1">
                  Bet on{" "}
                  <span className="text-white font-bold">
                    {betSelection}
                  </span>
                </div>

              </div>

              <button
                onClick={() =>
                  setIsSheetOpen(false)
                }
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            {/* BASE */}

            <div>

              <span className="text-[11px] text-gray-400 block mb-1.5">
                Base Amount
              </span>

              <div className="grid grid-cols-4 gap-2">

                {BASE_AMOUNTS.map(
                  (value) => (

                    <button
                      key={value}
                      onClick={() =>
                        setBaseUnit(value)
                      }
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        baseUnit === value
                          ? "bg-[#f5a623] text-black border-[#f5a623]"
                          : "bg-[#101217] border-gray-800 text-gray-300"
                      }`}
                    >
                      ₹{value}
                    </button>

                  )
                )}

              </div>

            </div>

            {/* MULTIPLIER */}

            <div>

              <span className="text-[11px] text-gray-400 block mb-1.5">
                Quantity
              </span>

              <div className="grid grid-cols-6 gap-1.5">

                {MULTIPLIERS.map(
                  (m) => (

                    <button
                      key={m}
                      onClick={() =>
                        setMultiplier(m)
                      }
                      className={`py-1.5 rounded-lg text-xs font-bold border ${
                        multiplier === m
                          ? "bg-[#f5a623] text-black border-[#f5a623]"
                          : "bg-[#101217] border-gray-800 text-gray-400"
                      }`}
                    >
                      X{m}
                    </button>

                  )
                )}

              </div>

            </div>

            {/* PAYOUT INFO */}

            <div className="bg-black/30 border border-gray-800 rounded-xl p-3">

              <div className="flex justify-between text-[11px]">

                <span className="text-gray-400">
                  Bet amount
                </span>

                <span>
                  ₹{totalBetAmount.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between text-[11px] mt-1">

                <span className="text-gray-400">
                  Demo payout
                </span>

                <span className="text-emerald-400">
                  {PAYOUTS[betType]}×
                </span>

              </div>

              <div className="flex justify-between text-[11px] mt-1">

                <span className="text-gray-400">
                  Winning deduction
                </span>

                <span className="text-gray-400">
                  0.3%
                </span>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex gap-3 pt-2">

              <button
                onClick={() =>
                  setIsSheetOpen(false)
                }
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBet}
                className="flex-1 bg-[#f5a623] hover:bg-[#e0961f] text-black py-3 rounded-xl text-xs font-bold"
              >
                Bet ₹
                {totalBetAmount.toFixed(2)}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}