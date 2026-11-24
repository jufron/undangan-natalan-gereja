import { useEffect, useState } from "react";
import { loadGuestSession, saveGuestSession } from "./utils/storage";
import WelcomeGate from "./components/WelcomeGate";
import Hero from "./components/Hero";
import Greeting from "./components/Greeting";
import Countdown from "./components/Countdown";
import EventDetails from "./components/EventDetails";
import RsvpSummarySection from "./components/RsvpSummarySection";
import ShareSection from "./components/ShareSection";
import Footer from "./components/Footer";
import MusicPlayer from "./components/MusicPlayer";
import PanitiaPanel from "./components/PanitiaPanel";

function isPanitiaQueryActive() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("panitia") === "1";
}

export default function App() {
  const [session, setSession] = useState(() => loadGuestSession());
  const [stage, setStage] = useState(() =>
    loadGuestSession()?.unlocked ? "unlocked" : "welcome"
  );
  const [showPanitia, setShowPanitia] = useState(() => isPanitiaQueryActive());

  useEffect(() => {
    function handlePopState() {
      setShowPanitia(isPanitiaQueryActive());
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function openPanitiaView() {
    const url = new URL(window.location.href);
    url.searchParams.set("panitia", "1");
    window.history.pushState({}, "", url.toString());
    setShowPanitia(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function closePanitiaView() {
    const url = new URL(window.location.href);
    url.searchParams.delete("panitia");
    window.history.pushState({}, "", url.toString());
    setShowPanitia(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function handleUnlock(payload) {
    const saved = saveGuestSession({
      namaLengkap: payload.namaLengkap,
      jumlahPeserta: payload.jumlahPeserta,
    });
    setSession(saved);
    setStage("unlocked");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  if (showPanitia) {
    return <PanitiaPanel onBack={closePanitiaView} />;
  }

  if (stage !== "unlocked") {
    return (
      <WelcomeGate
        stage={stage}
        onOpenForm={() => setStage("form")}
        onBackToWelcome={() => setStage("welcome")}
        onUnlock={handleUnlock}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8FD] text-[#1A0B22]">
      <Hero guestName={session?.namaLengkap || ""} />
      <main className="flex-1">
        <Greeting />
        <Countdown />
        <EventDetails />
        <RsvpSummarySection session={session} />
        <ShareSection />
      </main>
      <Footer onOpenPanitia={openPanitiaView} />
      <MusicPlayer />
    </div>
  );
}
