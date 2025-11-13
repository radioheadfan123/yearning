// pages/index.js
import { useEffect, useRef } from "react";

export default function Home() {
  const sessionIdRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const startSession = async () => {
      try {
        const res = await fetch("/api/session/start", { method: "POST" });
        const data = await res.json();
        sessionIdRef.current = data.sessionId;
      } catch (e) {
        console.error(e);
      }
    };

    startSession();

    const endSession = async () => {
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

    const handleBeforeUnload = () => endSession();

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        endSession();
      }
    });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleNotifyClick = async () => {
    try {
      await fetch("/api/notify", { method: "POST" });
      alert("Notification email sent");
    } catch (e) {
      alert("Error sending email");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>My Spotify Playlist</h1>

      {/* Replace src with your actual embed URL from Spotify */}
      <iframe
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/playlist/YOUR_PLAYLIST_ID_HERE?utm_source=generator"
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>

      <button
        onClick={handleNotifyClick}
        style={{
          padding: "0.75rem 1.5rem",
          borderRadius: "999px",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Notify me
      </button>
    </main>
  );
}
