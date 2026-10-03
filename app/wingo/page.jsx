"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Info,
  Minus,
  Plus,
  RefreshCw,
  Volume2,
  WalletCards,
  X,
} from "lucide-react";

/* =========================================================
   CONFIG
========================================================= */

const MODES = [
  { label: "30 Sec", short: "30 Sec", duration: 30 },
  { label: "1 Min", short: "1 Min", duration: 60 },
  { label: "3 Min", short: "3 Min", duration: 180 },
  { label: "5 Min", short: "5 Min", duration: 300 },
];

const BASE_AMOUNTS = [1, 10, 100, 1000];
const MULTIPLIERS = [1, 5, 10, 20, 50, 100];

const PAGE_SIZE = 10;

/*
  Virtual/demo payout values.
  These are only for the simulated game.
*/
const PAYOUTS = {
  Color: {
    Green: 2,
    Red: 2,
    Violet: 4.5,
  },
  Size: {
    Big: 2,
    Small: 2,
  },
  Number: 9,
};

const WINNING_FEE = 0.003;

/* =========================================================
   GAME HELPERS
========================================================= */

function getPeriodInfo(duration) {
  const now = new Date();

  /*
    Use local epoch seconds for stable round boundaries.
  */
  const epoch = Math.floor(now.getTime() / 1000);

  const roundNumber = Math.floor(epoch / duration);

  const elapsed = epoch % duration;

  const remaining =
    duration - elapsed;

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const datePart =
    `${year}${month}${day}`;

  const period =
    `${datePart}${String(
      roundNumber + 1
    ).padStart(6, "0")}`;

  return {
    period,
    remaining,
    roundNumber,
  };
}

function randomNumber() {
  return Math.floor(Math.random() * 10);
}

function getColor(number) {
  if (number === 0 || number === 5) {
    return "Violet";
  }

  return number % 2 === 0
    ? "Red"
    : "Green";
}

function getSize(number) {
  return number >= 5
    ? "Big"
    : "Small";
}

function getColorClass(color) {
  if (color === "Green") {
    return "text-[#48c98b]";
  }

  if (color === "Red") {
    return "text-[#f05d68]";
  }

  return "text-[#a45cff]";
}

function getBallClass(number) {
  const color = getColor(number);

  if (color === "Green") {
    return "bg-gradient-to-br from-[#8be0ad] via-[#42bd80] to-[#168452] border-[#8ce4b2]";
  }

  if (color === "Red") {
    return "bg-gradient-to-br from-[#ff979c] via-[#f05760] to-[#b92e39] border-[#ff9b9f]";
  }

  return "bg-gradient-to-br from-[#d398ff] via-[#8d3fdb] to-[#512087] border-[#d2a1ff]";
}

function money(value) {
  return `₹${Number(value).toFixed(2)}`;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function WinGoPage() {
  const [modeIndex, setModeIndex] =
    useState(0);

  const mode = MODES[modeIndex];

  const [balance, setBalance] =
    useState(133.56);

  const [period, setPeriod] =
    useState("");

  const [remaining, setRemaining] =
    useState(mode.duration);

  const [results, setResults] =
    useState([]);

  const [bets, setBets] =
    useState([]);

  const [myHistory, setMyHistory] =
    useState([]);

  const [lastResult, setLastResult] =
    useState(null);

  const [modal, setModal] =
    useState(null);

  const [baseAmount, setBaseAmount] =
    useState(1);

  const [quantity, setQuantity] =
    useState(1);

  const [multiplier, setMultiplier] =
    useState(1);

  const [tab, setTab] =
    useState("game");

  const [page, setPage] =
    useState(1);

  const [toast, setToast] =
    useState("");

  const [announcement, setAnnouncement] =
    useState(
      "Welcome to Equra Play!"
    );

  const previousRoundRef =
    useRef(null);

  const initializedRef =
    useRef(false);

  /* =======================================================
     TOTAL BET
  ======================================================= */

  const totalAmount = useMemo(() => {
    return (
      baseAmount *
      quantity *
      multiplier
    );
  }, [
    baseAmount,
    quantity,
    multiplier,
  ]);

  /* =======================================================
     LOAD DEMO DATA
  ======================================================= */

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem(
          "pandora_user"
        );

      if (storedUser) {
        const user =
          JSON.parse(storedUser);

        if (
          user.balance !== undefined &&
          !Number.isNaN(
            Number(user.balance)
          )
        ) {
          setBalance(
            Number(user.balance)
          );
        }
      }

      const storedResults =
        localStorage.getItem(
          "wingo_demo_results"
        );

      if (storedResults) {
        const parsed =
          JSON.parse(storedResults);

        if (Array.isArray(parsed)) {
          setResults(parsed);
        }
      }

      const storedHistory =
        localStorage.getItem(
          "wingo_demo_my_history"
        );

      if (storedHistory) {
        const parsed =
          JSON.parse(storedHistory);

        if (Array.isArray(parsed)) {
          setMyHistory(parsed);
        }
      }
    } catch (error) {
      console.error(error);
    }

    initializedRef.current = true;
  }, []);

  /* =======================================================
     SAVE BALANCE
  ======================================================= */

  const updateBalance = useCallback(
    (value) => {
      const next =
        Number(value.toFixed(2));

      setBalance(next);

      try {
        const stored =
          localStorage.getItem(
            "pandora_user"
          );

        if (stored) {
          const user =
            JSON.parse(stored);

          user.balance = next;

          localStorage.setItem(
            "pandora_user",
            JSON.stringify(user)
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  /* =======================================================
     SAVE RESULTS
  ======================================================= */

  const saveResults = useCallback(
    (items) => {
      setResults(items);

      try {
        localStorage.setItem(
          "wingo_demo_results",
          JSON.stringify(items)
        );
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  /* =======================================================
     SAVE MY HISTORY
  ======================================================= */

  const saveMyHistory = useCallback(
    (items) => {
      setMyHistory(items);

      try {
        localStorage.setItem(
          "wingo_demo_my_history",
          JSON.stringify(items)
        );
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  /* =======================================================
     TOAST
  ======================================================= */

  const showToast = useCallback(
    (message) => {
      setToast(message);

      setTimeout(() => {
        setToast("");
      }, 2500);
    },
    []
  );

  /* =======================================================
     SETTLE ROUND
  ======================================================= */

  const settleRound = useCallback(
    (settledPeriod, roundBets) => {
      if (!settledPeriod) {
        return;
      }

      /*
        ONE random result for the entire round.
      */
      const number =
        randomNumber();

      const color =
        getColor(number);

      const size =
        getSize(number);

      const result = {
        period: settledPeriod,
        number,
        color,
        size,
        createdAt: Date.now(),
      };

      setLastResult(result);

      /*
        Put newest result first.
      */
      setResults((current) => {
        const next = [
          result,
          ...current.filter(
            (item) =>
              item.period !==
              settledPeriod
          ),
        ].slice(0, 100);

        try {
          localStorage.setItem(
            "wingo_demo_results",
            JSON.stringify(next)
          );
        } catch {}

        return next;
      });

      /*
        Settle user's bets.
      */
      if (roundBets.length === 0) {
        return;
      }

      let totalReturned = 0;

      const settled = roundBets.map(
        (bet) => {
          let won = false;

          if (bet.type === "Color") {
            won =
              bet.selection === color;
          }

          if (bet.type === "Size") {
            won =
              bet.selection === size;
          }

          if (bet.type === "Number") {
            won =
              Number(bet.selection) ===
              number;
          }

          if (!won) {
            return {
              ...bet,
              resultNumber: number,
              resultColor: color,
              resultSize: size,
              status: "LOSS",
              grossPayout: 0,
              fee: 0,
              netPayout: 0,
            };
          }

          let multiplierValue;

          if (bet.type === "Number") {
            multiplierValue =
              PAYOUTS.Number;
          } else if (
            bet.type === "Color"
          ) {
            multiplierValue =
              PAYOUTS.Color[
                bet.selection
              ];
          } else {
            multiplierValue =
              PAYOUTS.Size[
                bet.selection
              ];
          }

          const gross =
            bet.amount *
            multiplierValue;

          const fee =
            gross *
            WINNING_FEE;

          const net =
            gross - fee;

          totalReturned += net;

          return {
            ...bet,
            resultNumber: number,
            resultColor: color,
            resultSize: size,
            status: "WIN",
            grossPayout: gross,
            fee,
            netPayout: net,
          };
        }
      );

      /*
        Stake was already deducted when
        the bet was placed.

        Only winning payouts are returned.
      */
      if (totalReturned > 0) {
        updateBalance(
          balance + totalReturned
        );
      }

      /*
        Add to My History.
      */
      setMyHistory((current) => {
        const next = [
          ...settled,
          ...current,
        ].slice(0, 200);

        try {
          localStorage.setItem(
            "wingo_demo_my_history",
            JSON.stringify(next)
          );
        } catch {}

        return next;
      });

      const wins =
        settled.filter(
          (item) =>
            item.status === "WIN"
        ).length;

      const losses =
        settled.filter(
          (item) =>
            item.status === "LOSS"
        ).length;

      showToast(
        `${number} • ${color} • ${size} — ${wins} WIN / ${losses} LOSS`
      );
    },
    [
      balance,
      showToast,
      updateBalance,
    ]
  );

  /* =======================================================
     CLOCK
  ======================================================= */

  useEffect(() => {
    let previousRound =
      previousRoundRef.current;

    const tick = () => {
      const info =
        getPeriodInfo(
          mode.duration
        );

      setPeriod(info.period);
      setRemaining(info.remaining);

      if (
        initializedRef.current &&
        previousRound &&
        previousRound !== info.period
      ) {
        /*
          Capture bets belonging to the
          round that just ended.
        */
        setBets((current) => {
          const expired =
            current.filter(
              (bet) =>
                bet.period ===
                previousRound
            );

          if (expired.length > 0) {
            settleRound(
              previousRound,
              expired
            );
          }

          return current.filter(
            (bet) =>
              bet.period !==
              previousRound
          );
        });
      }

      previousRound =
        info.period;

      previousRoundRef.current =
        info.period;
    };

    tick();

    const timer =
      setInterval(
        tick,
        250
      );

    return () =>
      clearInterval(timer);
  }, [
    mode.duration,
    settleRound,
  ]);

  /* =======================================================
     RESET MODE
  ======================================================= */

  const changeMode = (index) => {
    setModeIndex(index);

    setModal(null);

    /*
      New mode means a different round clock.
    */
    previousRoundRef.current =
      null;

    setRemaining(
      MODES[index].duration
    );
  };

  /* =======================================================
     OPEN BET MODAL
  ======================================================= */

  const openBet = (
    type,
    selection
  ) => {
    if (remaining <= 5) {
      showToast(
        "Betting locked for the final 5 seconds"
      );

      return;
    }

    setModal({
      type,
      selection,
    });

    setBaseAmount(1);
    setQuantity(1);
    setMultiplier(1);
  };

  /* =======================================================
     PLACE BET
  ======================================================= */

  const placeBet = () => {
    if (!modal) {
      return;
    }

    if (remaining <= 5) {
      showToast(
        "Round is locked"
      );

      return;
    }

    if (totalAmount > balance) {
      showToast(
        "Insufficient virtual balance"
      );

      return;
    }

    const bet = {
      id:
        `${Date.now()}-${Math.random()}`,

      period,

      type: modal.type,

      selection:
        modal.selection,

      amount: totalAmount,

      createdAt: Date.now(),
    };

    /*
      Deduct stake immediately.
    */
    updateBalance(
      balance - totalAmount
    );

    setBets((current) => [
      ...current,
      bet,
    ]);

    setModal(null);

    showToast(
      `Bet placed • ${money(
        totalAmount
      )}`
    );
  };

  /* =======================================================
     PAGINATION
  ======================================================= */

  const activeList =
    tab === "game"
      ? results
      : myHistory;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        activeList.length /
          PAGE_SIZE
      )
    );

  const safePage =
    Math.min(
      page,
      totalPages
    );

  const visibleItems =
    activeList.slice(
      (safePage - 1) *
        PAGE_SIZE,
      safePage *
        PAGE_SIZE
    );

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setPage(1);
  };

  /* =======================================================
     LAST 5 RESULTS
  ======================================================= */

  const recentResults =
    results.slice(0, 5);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#222222] text-white">

      <div className="mx-auto w-full max-w-[430px] min-h-screen bg-[#242424] relative overflow-hidden">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="h-[68px] bg-[#414141] flex items-center justify-between px-5 sticky top-0 z-40 shadow-lg">

          <Link
            href="/user/select-panel"
            className="text-white"
          >
            <ArrowLeft
              size={27}
              strokeWidth={2}
            />
          </Link>

          <div className="font-serif tracking-[0.22em] text-[23px] font-semibold">
            EQURA PLAY
          </div>

          <div className="w-[27px]" />

        </header>

        <div className="px-5 pb-8">

          {/* =================================================
              WALLET
          ================================================= */}

          <section className="mt-4 rounded-[32px] bg-gradient-to-br from-[#ffe9a3] via-[#efd17c] to-[#d8ae4b] p-5 text-[#744414] shadow-xl">

            <div className="flex justify-between items-start">

              <div>

                <div className="flex items-center gap-2 text-[15px]">
                  <WalletCards
                    size={19}
                  />
                  Wallet balance
                </div>

                <div className="text-[30px] font-bold mt-1">
                  ₹{balance.toFixed(2)}
                </div>

              </div>

              <button
                onClick={() =>
                  showToast(
                    "Balance refreshed"
                  )
                }
                className="p-2"
              >
                <RefreshCw
                  size={21}
                />
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">

              {/* Demo buttons intentionally do not
                  perform real transactions. */}

              <button
                onClick={() =>
                  showToast(
                    "Demo deposit screen"
                  )
                }
                className="rounded-lg bg-[#8b5218] py-3 text-white font-semibold"
              >
                Deposit
              </button>

              <button
                onClick={() =>
                  showToast(
                    "Demo withdrawal screen"
                  )
                }
                className="rounded-lg border-2 border-[#8b5218] py-3 text-[#744414] font-semibold"
              >
                Withdraw
              </button>

            </div>

          </section>

          {/* =================================================
              ANNOUNCEMENT
          ================================================= */}

          <section className="mt-4 rounded-[20px] bg-gradient-to-r from-[#ffe9a3] to-[#e1bd63] text-[#35250f] px-4 py-3 flex items-center gap-3">

            <Volume2
              size={21}
            />

            <span className="text-[15px]">
              {announcement}
            </span>

          </section>

          {/* =================================================
              MODE TABS
          ================================================= */}

          <section className="mt-4 rounded-[20px] bg-[#363636] p-2 grid grid-cols-4 gap-1">

            {MODES.map(
              (item, index) => (
                <button
                  key={item.label}
                  onClick={() =>
                    changeMode(index)
                  }
                  className={`rounded-[18px] min-h-[102px] flex flex-col items-center justify-center gap-2 transition ${
                    modeIndex === index
                      ? "bg-gradient-to-b from-[#ffe9a3] to-[#e6c46e] text-[#76501b]"
                      : "text-[#dddddd]"
                  }`}
                >

                  <div
                    className={`w-11 h-11 rounded-full border-4 flex items-center justify-center ${
                      modeIndex === index
                        ? "border-[#c79738]"
                        : "border-[#d9d9d9]"
                    }`}
                  >
                    <Clock3
                      size={25}
                    />
                  </div>

                  <span className="text-[14px] font-medium text-center leading-4">
                    Win Go
                    <br />
                    {item.short}
                  </span>

                </button>
              )
            )}

          </section>

          {/* =================================================
              PERIOD / TIMER
          ================================================= */}

          <section className="mt-4 rounded-[22px] bg-gradient-to-r from-[#ffe7a0] via-[#efd078] to-[#e2bc5e] text-[#704815] p-4">

            <div className="grid grid-cols-[1fr_1.05fr] gap-3">

              <div>

                <button
                  onClick={() =>
                    showToast(
                      "Choose a number, color or size before placing a virtual bet."
                    )
                  }
                  className="rounded-full border border-[#9b702a] px-5 py-2 text-[13px]"
                >
                  <Info
                    size={14}
                    className="inline mr-1"
                  />
                  How to play
                </button>

                <div className="mt-3 text-[14px]">
                  Win Go{" "}
                  {mode.short}
                </div>

                <div className="flex gap-2 mt-2">

                  {recentResults.map(
                    (item) => (
                      <div
                        key={item.period}
                        className={`w-9 h-9 rounded-full border-2 border-white/70 flex items-center justify-center text-sm font-bold text-white shadow-md ${getBallClass(
                          item.number
                        )}`}
                      >
                        {item.number}
                      </div>
                    )
                  )}

                </div>

              </div>

              <div className="text-right">

                <div className="text-[15px] font-semibold">
                  Time remaining
                </div>

                <div className="flex justify-end items-center gap-1 mt-2 font-mono font-bold">

                  {String(
                    Math.floor(
                      remaining / 60
                    )
                  )
                    .padStart(2, "0")
                    .split("")
                    .map(
                      (digit, index) => (
                        <span
                          key={`m-${index}`}
                          className="bg-[#fff4ca] px-2 py-2 text-[23px]"
                        >
                          {digit}
                        </span>
                      )
                    )}

                  <span className="text-[22px]">
                    :
                  </span>

                  {String(
                    remaining % 60
                  )
                    .padStart(2, "0")
                    .split("")
                    .map(
                      (digit, index) => (
                        <span
                          key={`s-${index}`}
                          className="bg-[#fff4ca] px-2 py-2 text-[23px]"
                        >
                          {digit}
                        </span>
                      )
                    )}

                </div>

                <div className="mt-2 text-[19px] font-bold tracking-wide">
                  {period}
                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              COLOR BUTTONS
          ================================================= */}

          <section className="mt-3 bg-[#303030] rounded-[18px] p-3">

            <div className="grid grid-cols-3 gap-4">

              <button
                onClick={() =>
                  openBet(
                    "Color",
                    "Green"
                  )
                }
                disabled={
                  remaining <= 5
                }
                className="rounded-[13px] bg-[#49b87c] py-4 text-[18px] font-medium disabled:opacity-40"
              >
                Green
              </button>

              <button
                onClick={() =>
                  openBet(
                    "Color",
                    "Violet"
                  )
                }
                disabled={
                  remaining <= 5
                }
                className="rounded-[13px] bg-[#9948dc] py-4 text-[18px] font-medium disabled:opacity-40"
              >
                Violet
              </button>

              <button
                onClick={() =>
                  openBet(
                    "Color",
                    "Red"
                  )
                }
                disabled={
                  remaining <= 5
                }
                className="rounded-[13px] bg-[#e95760] py-4 text-[18px] font-medium disabled:opacity-40"
              >
                Red
              </button>

            </div>

            {/* =================================================
                NUMBER BALLS
            ================================================= */}

            <div className="grid grid-cols-5 gap-3 mt-4">

              {Array.from(
                { length: 10 },
                (_, number) => (
                  <button
                    key={number}
                    disabled={
                      remaining <= 5
                    }
                    onClick={() =>
                      openBet(
                        "Number",
                        number
                      )
                    }
                    className={`relative aspect-square rounded-full border-2 flex items-center justify-center text-[29px] font-bold text-white shadow-lg overflow-hidden disabled:opacity-40 ${getBallClass(
                      number
                    )}`}
                  >

                    {/* decorative highlight */}
                    <span className="absolute top-1 left-2 w-4 h-2 rounded-full bg-white/70 rotate-[-20deg]" />

                    <span className="relative z-10">
                      {number}
                    </span>

                  </button>
                )
              )}

            </div>

            {/* =================================================
                MULTIPLIER ROW
            ================================================= */}

            <div className="flex gap-2 mt-5 overflow-x-auto pb-1">

              <button
                onClick={() => {
                  setMultiplier(1);
                  setQuantity(1);
                }}
                className={`shrink-0 px-5 py-3 rounded-xl border ${
                  multiplier === 1
                    ? "border-[#e4bb56] text-[#e4bb56]"
                    : "border-[#777] text-[#ddd]"
                }`}
              >
                Random
              </button>

              {MULTIPLIERS.map(
                (item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setMultiplier(item)
                    }
                    className={`shrink-0 px-4 py-3 rounded-xl ${
                      multiplier === item
                        ? "bg-[#e6bd55] text-[#51340d]"
                        : "bg-[#bfc0c5] text-[#353535]"
                    }`}
                  >
                    X{item}
                  </button>
                )
              )}

            </div>

            {/* =================================================
                BIG SMALL
            ================================================= */}

            <div className="grid grid-cols-2 mt-4 rounded-full overflow-hidden">

              <button
                onClick={() =>
                  openBet(
                    "Size",
                    "Big"
                  )
                }
                disabled={
                  remaining <= 5
                }
                className="bg-[#f7af46] py-4 text-[20px] disabled:opacity-40"
              >
                Big
              </button>

              <button
                onClick={() =>
                  openBet(
                    "Size",
                    "Small"
                  )
                }
                disabled={
                  remaining <= 5
                }
                className="bg-[#6f9de7] py-4 text-[20px] disabled:opacity-40"
              >
                Small
              </button>

            </div>

          </section>

          {/* =================================================
              HISTORY TABS
          ================================================= */}

          <section className="mt-5">

            <div className="grid grid-cols-3 gap-4">

              <button
                onClick={() =>
                  changeTab("game")
                }
                className={`rounded-[14px] py-4 text-[17px] ${
                  tab === "game"
                    ? "bg-gradient-to-b from-[#ffe9a3] to-[#e5bd5c] text-[#76501b]"
                    : "bg-[#3b3b3b] text-[#ddd]"
                }`}
              >
                Game history
              </button>

              <button
                onClick={() =>
                  changeTab("chart")
                }
                className={`rounded-[14px] py-4 text-[17px] ${
                  tab === "chart"
                    ? "bg-gradient-to-b from-[#ffe9a3] to-[#e5bd5c] text-[#76501b]"
                    : "bg-[#3b3b3b] text-[#ddd]"
                }`}
              >
                Chart
              </button>

              <button
                onClick={() =>
                  changeTab("my")
                }
                className={`rounded-[14px] py-4 text-[17px] ${
                  tab === "my"
                    ? "bg-gradient-to-b from-[#ffe9a3] to-[#e5bd5c] text-[#76501b]"
                    : "bg-[#3b3b3b] text-[#ddd]"
                }`}
              >
                My history
              </button>

            </div>

            {/* =================================================
                GAME HISTORY
            ================================================= */}

            {tab === "game" && (
              <div className="mt-4 rounded-[14px] overflow-hidden bg-[#393939]">

                <div className="grid grid-cols-[1.5fr_.65fr_1fr_.55fr] bg-[#727272] px-2 py-4 text-center font-semibold">

                  <span>Period</span>
                  <span>Number</span>
                  <span>Big Small</span>
                  <span>Color</span>

                </div>

                {visibleItems.length === 0 ? (
                  <div className="py-12 text-center text-[#aaa]">
                    Results will appear after the first round.
                  </div>
                ) : (
                  visibleItems.map(
                    (item) => (
                      <div
                        key={item.period}
                        className="grid grid-cols-[1.5fr_.65fr_1fr_.55fr] px-2 py-4 text-center border-b border-[#505050]"
                      >

                        <span className="text-[12px] flex items-center justify-center">
                          {item.period}
                        </span>

                        <span
                          className={`text-[29px] font-bold ${getColorClass(
                            item.color
                          )}`}
                        >
                          {item.number}
                        </span>

                        <span className="flex items-center justify-center">
                          {item.size}
                        </span>

                        <span className="flex justify-center items-center">

                          <span
                            className={`w-5 h-5 rounded-full ${getBallClass(
                              item.number
                            )}`}
                          />

                        </span>

                      </div>
                    )
                  )
                )}

              </div>
            )}

            {/* =================================================
                CHART
            ================================================= */}

            {tab === "chart" && (
              <div className="mt-4 rounded-[14px] bg-[#393939] p-5">

                <div className="text-center text-[#aaa] mb-5">
                  Recent virtual results
                </div>

                <div className="flex flex-wrap justify-center gap-3">

                  {results
                    .slice(0, 30)
                    .map((item) => (
                      <div
                        key={item.period}
                        className="text-center"
                      >

                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${getBallClass(
                            item.number
                          )}`}
                        >
                          {item.number}
                        </div>

                        <div className="text-[9px] text-[#aaa] mt-1">
                          {item.size}
                        </div>

                      </div>
                    ))}

                </div>

              </div>
            )}

            {/* =================================================
                MY HISTORY
            ================================================= */}

            {tab === "my" && (
              <div className="mt-4 rounded-[14px] overflow-hidden bg-[#393939]">

                {visibleItems.length === 0 ? (
                  <div className="py-12 text-center text-[#aaa]">
                    You have no virtual bets yet.
                  </div>
                ) : (
                  visibleItems.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="p-4 border-b border-[#505050]"
                      >

                        <div className="flex justify-between">

                          <div>
                            <div className="font-semibold">
                              {item.selection}
                            </div>

                            <div className="text-[11px] text-[#999]">
                              {item.type} • Period{" "}
                              {item.period}
                            </div>
                          </div>

                          <div
                            className={
                              item.status ===
                              "WIN"
                                ? "text-[#48c98b]"
                                : "text-[#f05d68]"
                            }
                          >
                            {item.status}
                          </div>

                        </div>

                        <div className="flex justify-between mt-3 text-sm">

                          <span>
                            Bet{" "}
                            {money(
                              item.amount
                            )}
                          </span>

                          <span>
                            {item.status ===
                            "WIN"
                              ? `+${money(
                                  item.netPayout
                                )}`
                              : "₹0.00"}
                          </span>

                        </div>

                      </div>
                    )
                  )
                )}

              </div>
            )}

            {/* =================================================
                PAGINATION
            ================================================= */}

            <div className="mt-4 bg-[#393939] rounded-[12px] p-5 flex items-center justify-between">

              <button
                disabled={
                  safePage <= 1
                }
                onClick={() =>
                  setPage(
                    (p) =>
                      Math.max(
                        1,
                        p - 1
                      )
                  )
                }
                className="w-16 h-14 rounded-xl bg-[#c9c9ce] text-[#555] disabled:opacity-40 flex items-center justify-center"
              >
                <ChevronLeft
                  size={30}
                />
              </button>

              <span className="text-[#ddd]">
                {safePage}/{totalPages}
              </span>

              <button
                disabled={
                  safePage >=
                  totalPages
                }
                onClick={() =>
                  setPage(
                    (p) =>
                      Math.min(
                        totalPages,
                        p + 1
                      )
                  )
                }
                className="w-16 h-14 rounded-xl bg-[#e7c25e] text-[#76501b] disabled:opacity-40 flex items-center justify-center"
              >
                <ChevronRight
                  size={30}
                />
              </button>

            </div>

          </section>

        </div>

        {/* =====================================================
            BETTING MODAL
        ===================================================== */}

        {modal && (
          <div className="fixed inset-0 z-[100] bg-black/75 flex items-end justify-center">

            <div className="w-full max-w-[430px] bg-[#292929] rounded-t-[30px] overflow-hidden">

              {/* HEADER */}

              <div className="relative bg-gradient-to-b from-[#666] to-[#333] px-5 pt-5 pb-12 text-center">

                <button
                  onClick={() =>
                    setModal(null)
                  }
                  className="absolute right-4 top-4 text-white"
                >
                  <X />
                </button>

                <div className="text-[22px] font-bold">
                  Win Go{" "}
                  {mode.short}
                </div>

                <div className="mt-4 rounded-lg bg-[#444] py-3 text-[#f2bd42]">
                  Select{" "}
                  <span className="font-bold">
                    {modal.selection}
                  </span>
                </div>

              </div>

              {/* BODY */}

              <div className="px-6 py-5">

                {/* BALANCE */}

                <div className="flex items-center justify-between">

                  <span className="text-[20px]">
                    Balance
                  </span>

                  <div className="flex gap-3">

                    {BASE_AMOUNTS.map(
                      (amount) => (
                        <button
                          key={amount}
                          onClick={() =>
                            setBaseAmount(
                              amount
                            )
                          }
                          className={`px-4 py-3 rounded-lg ${
                            baseAmount ===
                            amount
                              ? "bg-[#e7bd55] text-[#51350d]"
                              : "bg-[#414141] text-[#ddd]"
                          }`}
                        >
                          {amount}
                        </button>
                      )
                    )}

                  </div>

                </div>

                {/* QUANTITY */}

                <div className="mt-7 flex items-center justify-between">

                  <span className="text-[20px]">
                    Quantity
                  </span>

                  <div className="flex items-center gap-3">

                    <button
                      onClick={() =>
                        setQuantity(
                          (q) =>
                            Math.max(
                              1,
                              q - 1
                            )
                        )
                      }
                      className="w-11 h-11 rounded-full bg-[#e7bd55] text-[#583b0e] flex items-center justify-center"
                    >
                      <Minus />
                    </button>

                    <div className="w-32 h-11 rounded-full bg-[#7f8293] flex items-center justify-center text-white">
                      {quantity}
                    </div>

                    <button
                      onClick={() =>
                        setQuantity(
                          (q) =>
                            q + 1
                        )
                      }
                      className="w-11 h-11 rounded-full bg-[#e7bd55] text-[#583b0e] flex items-center justify-center"
                    >
                      <Plus />
                    </button>

                  </div>

                </div>

                {/* MULTIPLIERS */}

                <div className="grid grid-cols-6 gap-2 mt-7">

                  {MULTIPLIERS.map(
                    (value) => (
                      <button
                        key={value}
                        onClick={() =>
                          setMultiplier(
                            value
                          )
                        }
                        className={`py-3 rounded-lg text-[14px] ${
                          multiplier ===
                          value
                            ? "bg-[#e7bd55] text-[#55380b]"
                            : "bg-[#414141] text-[#ddd]"
                        }`}
                      >
                        X{value}
                      </button>
                    )
                  )}

                </div>

                {/* DEMO RULE */}

                <div className="mt-6 flex items-center gap-3 text-[#ddd]">

                  <div className="w-7 h-7 rounded-full border-2 border-[#e7bd55] flex items-center justify-center text-[#e7bd55]">
                    ✓
                  </div>

                  <span>
                    I agree
                  </span>

                  <button
                    onClick={() =>
                      showToast(
                        "Virtual game rules"
                      )
                    }
                    className="text-[#e7bd55]"
                  >
                    《Pre-sale rules》
                  </button>

                </div>

              </div>

              {/* FOOTER */}

              <div className="grid grid-cols-2">

                <button
                  onClick={() =>
                    setModal(null)
                  }
                  className="bg-[#454545] py-5 text-[#ddd] text-[17px]"
                >
                  Cancel
                </button>

                <button
                  onClick={placeBet}
                  className="bg-[#e3ba4f] py-5 text-[#57390b] text-[17px] font-semibold"
                >
                  Total amount{" "}
                  {money(
                    totalAmount
                  )}
                </button>

              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            TOAST
        ===================================================== */}

        {toast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-black/90 text-white px-5 py-3 rounded-xl text-sm shadow-2xl">
            {toast}
          </div>
        )}

      </div>
    </main>
  );
}