"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const sessionIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const endedRef = useRef(false);

  const iframeSrc =
    "https://open.spotify.com/embed/playlist/5256oAdo6TRD7ZNIt74oZM?utm_source=generator";

  const startSession = async () => {
    try {
      const res = await fetch("/api/session/start", { method: "POST" });
      const data = await res.json();
      sessionIdRef.current = data.sessionId;
      startTimeRef.current = Date.now();
      endedRef.current = false;
    } catch (e) {
      console.error(e);
    }
  };

  const endSession = async () => {
    if (endedRef.current) return;
    endedRef.current = true;
    if (!sessionIdRef.current || !startTimeRef.current) return;

    try {
      const durationMs = Date.now() - startTimeRef.current;
      await fetch("/api/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          durationMs,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    startSession();

    const handleBeforeUnload = () => {
      endSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        endSession();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNotifyClick = async () => {
    try {
      await fetch("/api/notify", { method: "POST" });
      alert("i saw that you were here. thank you.");
    } catch (e) {
      alert("error sending notification");
    }
  };

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "serif",
          background:
            "radial-gradient(circle at top, #1b0f24 0%, #0c0610 60%, #050308 100%)",
          color: "#f4e9ff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* soft dust particles / stars */}
        <div className="dust-layer">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="dust-dot" />
          ))}
        </div>

        <div
          style={{
            maxWidth: "1150px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1.7fr 2fr",
            gap: "2rem",
          }}
        >
          {/* LEFT CARD: photos + playlist */}
          <div
            className="fade-in-card"
            style={{
              background: "rgba(21, 14, 32, 0.92)",
              borderRadius: "1.5rem",
              padding: "1.5rem",
              boxShadow:
                "0 25px 55px rgba(0,0,0,0.8), 0 0 0 1px rgba(129, 90, 160, 0.35)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            {/* side-by-side images */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                className="fade-in-img float-left-img"
                src="/left-photo.jpg"
                alt="you"
                style={{
                  width: "48%",
                  height: "260px",
                  objectFit: "cover",
                  borderRadius: "1.2rem",
                  boxShadow: "0 12px 35px rgba(149, 106, 255, 0.45)",
                }}
              />

              <img
                className="fade-in-img float-right-img"
                src="/right-photo.jpg"
                alt="me"
                style={{
                  width: "48%",
                  height: "260px",
                  objectFit: "cover",
                  borderRadius: "1.2rem",
                  boxShadow: "0 12px 35px rgba(255, 100, 165, 0.45)",
                }}
              />
            </div>

            {/* playlist box */}
            <div
              className="fade-in-iframe"
              style={{
                width: "100%",
                background: "rgba(39, 24, 55, 0.5)",
                borderRadius: "1.2rem",
                padding: "0.75rem",
                boxShadow: "0 20px 45px rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(212, 171, 255, 0.2)",
              }}
            >
              <iframe
                style={{
                  borderRadius: "12px",
                  width: "100%",
                  height: "352px",
                  border: "none",
                  display: "block",
                }}
                src={iframeSrc}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* RIGHT CARD: letter + cats button */}
          <div
            className="fade-in-card"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(254, 242, 255, 0.03), transparent 55%), rgba(19, 12, 33, 0.98)",
              borderRadius: "1.5rem",
              padding: "1.8rem 1.7rem 1.4rem",
              boxShadow:
                "0 22px 50px rgba(0,0,0,0.85), 0 0 0 1px rgba(248, 219, 255, 0.15)",
              border: "1px solid rgba(255,255,255,0.12)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* subtle paper texture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "100% 22px",
                opacity: 0.6,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 0 0, rgba(255,255,255,0.06), transparent 55%)",
                mixBlendMode: "soft-light",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                marginBottom: "1rem",
              }}
            >
              <h2
                style={{
                  marginBottom: "1rem",
                  fontSize: "2rem",
                  color: "#f9eaff",
                  textAlign: "center",
                  letterSpacing: "0.06em",
                }}
              >
                hi my sweet girl
              </h2>

              <p
                style={{
                  marginBottom: "1.1rem",
                  opacity: 0.95,
                  lineHeight: 1.7,
                  fontSize: "0.98rem",
                  color: "#e7daf7",
                }}
              >
i made this for you the way people leave the lights on in a room they’ve already walked out of. not to call you back, not to pull you from the quiet you asked for. just to keep it warm, a place you could return to if you ever wanted. a little trace of me so you won’t forget i was here. 
              </p>

              <p
                style={{
                  marginBottom: "1.1rem",
                  opacity: 0.95,
                  lineHeight: 1.7,
                  fontSize: "0.98rem",
                  color: "#e7daf7",
                }}
              >
you’re allowed to choose yourself. i’m not waiting, and i’m not putting my life on pause for a maybe. i’ll learn to walk forward without checking over my shoulder for you. and maybe, with enough time, you’ll fade into a distant memory, and i’ll unlearn the things i once knew about you by heart to make room for someone else.
              </p>

              <p
                style={{
                  opacity: 0.95,
                  lineHeight: 1.7,
                  fontSize: "0.98rem",
                  color: "#e7daf7",
                }}
              >
but if someday, after you’ve taken all the time and space you needed, you no longer want to be alone… tell me. it won't matter where i am or who i'm with, you let me know and i'll be waiting on the steps of our home with the porch lights on, your clothes still in my hamper, your makeup in my bathroom drawer, and your toothbrush still laying beside mine.
              </p>
            </div>

            {/* cats button */}
            <div
              style={{
                position: "relative",
                textAlign: "center",
                marginTop: "0.5rem",
              }}
            >
              <button
                onClick={handleNotifyClick}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <svg
                  className="cats-btn"
                  width="150"
                  height="90"
                  viewBox="0 0 150 90"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="150" height="90" fill="rgba(0,0,0,0)" />

                  {/* CHOCOLATE BROWN CAT (left) */}
                  {/* ears */}
                  <rect x="15" y="10" width="14" height="14" fill="#5C3A23" />
                  <rect x="41" y="10" width="14" height="14" fill="#5C3A23" />
                  <rect
                    x="16"
                    y="11"
                    width="12"
                    height="12"
                    fill="#A87A5E"
                  />
                  <rect
                    x="42"
                    y="11"
                    width="12"
                    height="12"
                    fill="#A87A5E"
                  />

                  {/* head */}
                  <rect x="12" y="24" width="48" height="38" fill="#6B442B" />

                  {/* eyes */}
                  <rect
                    className="cat1-eye"
                    x="22"
                    y="34"
                    width="8"
                    height="8"
                    fill="#000000"
                  />
                  <rect
                    className="cat1-eye"
                    x="40"
                    y="34"
                    width="8"
                    height="8"
                    fill="#000000"
                  />

                  {/* whiskers */}
                  <rect x="17" y="40" width="8" height="2" fill="#D9C2B0" />
                  <rect x="17" y="43" width="8" height="2" fill="#D9C2B0" />
                  <rect x="47" y="40" width="8" height="2" fill="#D9C2B0" />
                  <rect x="47" y="43" width="8" height="2" fill="#D9C2B0" />

                  {/* nose */}
                  <rect x="32" y="44" width="6" height="4" fill="#3E2415" />

                  {/* tail */}
                  <rect
                    className="cat1-tail"
                    x="5"
                    y="35"
                    width="6"
                    height="22"
                    fill="#6B442B"
                  />

                  {/* ORANGE TABBY CAT (right) */}
                  {/* ears */}
                  <rect x="85" y="10" width="14" height="14" fill="#C96B2B" />
                  <rect x="111" y="10" width="14" height="14" fill="#C96B2B" />
                  <rect
                    x="86"
                    y="11"
                    width="12"
                    height="12"
                    fill="#F7B683"
                  />
                  <rect
                    x="112"
                    y="11"
                    width="12"
                    height="12"
                    fill="#F7B683"
                  />

                  {/* head */}
                  <rect x="82" y="24" width="48" height="38" fill="#DE8A41" />

                  {/* eyes */}
                  <rect
                    className="cat2-eye"
                    x="92"
                    y="34"
                    width="8"
                    height="8"
                    fill="#000000"
                  />
                  <rect
                    className="cat2-eye"
                    x="110"
                    y="34"
                    width="8"
                    height="8"
                    fill="#000000"
                  />

                  {/* whiskers */}
                  <rect x="87" y="40" width="8" height="2" fill="#FFD5B8" />
                  <rect x="87" y="43" width="8" height="2" fill="#FFD5B8" />
                  <rect x="117" y="40" width="8" height="2" fill="#FFD5B8" />
                  <rect x="117" y="43" width="8" height="2" fill="#FFD5B8" />

                  {/* nose */}
                  <rect x="102" y="44" width="6" height="4" fill="#8A4F1F" />

                  {/* tail */}
                  <rect
                    className="cat2-tail"
                    x="133"
                    y="35"
                    width="6"
                    height="22"
                    fill="#DE8A41"
                  />

                  {/* HEART BETWEEN THEM */}
                  <rect
                    className="cats-heart"
                    x="65"
                    y="28"
                    width="8"
                    height="8"
                    fill="#D46A77"
                  />
                  <rect
                    className="cats-heart"
                    x="73"
                    y="28"
                    width="8"
                    height="8"
                    fill="#D46A77"
                  />
                  <rect
                    className="cats-heart"
                    x="62"
                    y="36"
                    width="26"
                    height="8"
                    fill="#D46A77"
                  />
                  <rect
                    className="cats-heart"
                    x="69"
                    y="44"
                    width="12"
                    height="8"
                    fill="#D46A77"
                  />
                </svg>

                <span
                  style={{
                    color: "#ffe0ee",
                    fontSize: "0.95rem",
                    marginTop: "0.1rem",
                  }}
                >
                  click here if you ever want to come home
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float-soft {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes float-soft-alt {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(6px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        @keyframes dust-move {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translate3d(0, -40px, 0);
            opacity: 0;
          }
        }

        .fade-in-card {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .fade-in-img {
          opacity: 0;
          animation: fade-in-up 1s ease-out forwards;
        }

        .fade-in-img.float-left-img {
          animation-delay: 0.2s;
        }

        .fade-in-img.float-right-img {
          animation-delay: 0.3s;
        }

        .fade-in-iframe {
          opacity: 0;
          animation: fade-in-up 0.9s ease-out forwards;
          animation-delay: 0.4s;
        }

        .dust-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .dust-dot {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: rgba(248, 250, 252, 0.6);
          animation: dust-move 14s linear infinite;
        }

        .dust-dot:nth-child(1) {
          left: 10%;
          bottom: 5%;
          animation-delay: 0s;
        }
        .dust-dot:nth-child(2) {
          left: 25%;
          bottom: 10%;
          animation-delay: 2s;
        }
        .dust-dot:nth-child(3) {
          left: 40%;
          bottom: 8%;
          animation-delay: 4s;
        }
        .dust-dot:nth-child(4) {
          left: 55%;
          bottom: 12%;
          animation-delay: 1s;
        }
        .dust-dot:nth-child(5) {
          left: 70%;
          bottom: 6%;
          animation-delay: 3s;
        }
        .dust-dot:nth-child(6) {
          left: 85%;
          bottom: 9%;
          animation-delay: 5s;
        }
        .dust-dot:nth-child(7) {
          left: 15%;
          bottom: 20%;
          animation-delay: 6s;
        }
        .dust-dot:nth-child(8) {
          left: 30%;
          bottom: 18%;
          animation-delay: 7s;
        }
        .dust-dot:nth-child(9) {
          left: 45%;
          bottom: 22%;
          animation-delay: 8s;
        }
        .dust-dot:nth-child(10) {
          left: 60%;
          bottom: 19%;
          animation-delay: 9s;
        }
        .dust-dot:nth-child(11) {
          left: 75%;
          bottom: 21%;
          animation-delay: 10s;
        }
        .dust-dot:nth-child(12) {
          left: 90%;
          bottom: 17%;
          animation-delay: 11s;
        }

        /* cats animations */

        @keyframes catsBounce {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .cats-btn {
          image-rendering: pixelated;
          animation: catsBounce 2.4s ease-in-out infinite;
        }

        @keyframes blinkCats {
          0%,
          88%,
          100% {
            height: 8px;
          }
          90% {
            height: 2px;
          }
        }
        .cat1-eye,
        .cat2-eye {
          animation: blinkCats 3.8s infinite;
          transform-origin: center;
        }

        @keyframes tailWiggleLeft {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-12deg) translateX(-1px);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        .cat1-tail {
          animation: tailWiggleLeft 1.9s ease-in-out infinite;
          transform-origin: top center;
        }

        @keyframes tailWiggleRight {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(12deg) translateX(1px);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        .cat2-tail {
          animation: tailWiggleRight 1.9s ease-in-out infinite;
          transform-origin: top center;
        }

        @keyframes heartBeat {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        .cats-heart {
          animation: heartBeat 1.4s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </>
  );
}
