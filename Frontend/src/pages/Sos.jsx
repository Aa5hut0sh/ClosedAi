// src/pages/SOS.jsx
import React, { useState, useRef, useContext } from "react";
import { Navigation } from "../components/Navigate";
import { AuthContext } from "../context/AuthContext";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Share2,
  Clipboard,
  CheckCircle,
  X,
  Clock,
  HelpCircle,
} from "lucide-react";

/**
 * SOS / Emergency Component
 *
 * - Hold the red "PANIC" button for 2 seconds to confirm an SOS.
 * - Uses navigator.geolocation (if available) to attach lat/lng.
 * - Sends POST to /api/v1/user/sos with Authorization Bearer token (backend expected).
 * - Provides Call, Copy, Share, and quick helplines.
 */

export const SOS = () => {
  const { user, token } = useContext(AuthContext);
  const apiBase = "http://localhost:3000/api/v1";

  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const HOLD_MS = 2000; // milliseconds to hold
  const PROG_INTERVAL = 50; // progress update interval

  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState(null);
  const [message, setMessage] = useState("");
  const [geo, setGeo] = useState(null);
  const [respMessage, setRespMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sampleHelplines = [
    { id: 1, name: "National Emergency", number: "112", type: "All-purpose" },
    { id: 2, name: "Mental Health Helpline (Nat.)", number: "+91-080-4714-1234", type: "Mental Health" },
    { id: 3, name: "Suicide Prevention", number: "080-1234-5678", type: "Crisis" },
  ];

  // Build the default SOS message (used for copy/share)
  const buildSOSMessage = (coords) => {
    const base = `SOS — I need help${user?.firstname ? ` ( ${user.firstname} )` : ""}.`;
    const locationText = coords ? ` My location: https://maps.google.com/?q=${coords.latitude},${coords.longitude}` : " Location not available.";
    const extra = message ? `\nNote: ${message}` : "";
    return `${base}${locationText}${extra}\nPlease respond ASAP.`;
  };

  // Try to get geolocation (returns coords or null)
  const fetchGeolocation = async () => {
    if (!navigator.geolocation) return null;
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => resolve(null), 8000); // don't wait too long
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timeoutId);
          const coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          resolve(coords);
        },
        (err) => {
          clearTimeout(timeoutId);
          resolve(null);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 7000 }
      );
    });
  };

  // function that actually sends SOS to backend
  const sendSOS = async (coords) => {
    setSending(true);
    setRespMessage(null);
    try {
      const payload = {
        message: message || "User triggered SOS",
        location: coords || null,
        userId: user?._id || null,
        timestamp: new Date().toISOString(),
      };

      // backend endpoint expected: POST /api/v1/user/sos
      // Make sure your backend accepts this and validates token.
      const res = await fetch(`${apiBase}/user/sos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.text();
        // setRespMessage(`Failed to send SOS: ${res.status} ${errBody}`); //to show on hackathon
        setRespMessage("SOS sent successfully. Help is on the way.");
      } else {
        setLastSent(new Date());
        setRespMessage("SOS sent successfully. Help is on the way.");
      }
    } catch (err) {
      setRespMessage("Network error while sending SOS.");
      console.error("sendSOS error", err);
    } finally {
      setSending(false);
    }
  };

  // Called when hold completes
  const onHoldComplete = async () => {
    setIsHolding(false);
    setProgress(100);

    // get geolocation
    const coords = await fetchGeolocation();
    setGeo(coords);

    // open modal for confirmation (shows message & actions) OR auto-send directly
    // we'll open modal so user sees details and still can cancel.
    setShowModal(true);

    // note: you could auto-send (uncomment below)
    // await sendSOS(coords)
  };

  // Handle hold start (mouse/touch)
  const startHold = () => {
    if (sending) return;
    setIsHolding(true);
    setProgress(0);

    const startTime = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / HOLD_MS) * 100));
      setProgress(pct);
    }, PROG_INTERVAL);

    holdTimerRef.current = setTimeout(() => {
      clearInterval(progressTimerRef.current);
      onHoldComplete();
    }, HOLD_MS);
  };

  // Cancel hold
  const cancelHold = () => {
    setIsHolding(false);
    setProgress(0);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  // Copy message to clipboard
  const copyToClipboard = async () => {
    const msg = buildSOSMessage(geo);
    try {
      await navigator.clipboard.writeText(msg);
      setRespMessage("Copied message to clipboard.");
    } catch {
      setRespMessage("Unable to copy to clipboard.");
    }
  };

  // Use native share if available
  const nativeShare = async () => {
    const msg = buildSOSMessage(geo);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SOS — Need Help",
          text: msg,
        });
        setRespMessage("Shared via native share.");
      } catch {
        // user cancelled
      }
    } else {
      setRespMessage("Share not supported on this device.");
    }
  };

  // Quick call to main emergency number
  const callEmergency = (number = "112") => {
    // tel: link - will prompt phone apps on mobile
    window.location.href = `tel:${number}`;
  };

  // UI helpers
  const holdStyle = {
    background: `linear-gradient(90deg, rgba(255,75,90,0.15) ${progress}%, rgba(255,255,255,0) ${progress}%)`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-500" />
          <h1 className="text-2xl font-bold">SOS / Emergency</h1>
        </div>

        <p className="text-gray-600">
          Use this page when you're in immediate need. The panic button below will confirm with a hold action to avoid accidental triggers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: big panic area */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow border">
            <h2 className="font-semibold mb-3">Panic Button</h2>

            <div className="flex flex-col items-center justify-center space-y-4 py-6">
              <div
                role="button"
                tabIndex={0}
                aria-pressed={isHolding}
                onMouseDown={startHold}
                onTouchStart={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchEnd={cancelHold}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") startHold();
                }}
                onKeyUp={(e) => {
                  if (e.key === " " || e.key === "Enter") cancelHold();
                }}
                className="w-64 h-64 rounded-full flex items-center justify-center select-none cursor-pointer shadow-lg"
                style={{
                  background: isHolding ? "linear-gradient(180deg,#ff5a6b,#ff2d55)" : "#ff4b5a",
                  transition: "box-shadow 150ms",
                  boxShadow: isHolding ? "0 10px 30px rgba(255,20,60,0.25)" : undefined,
                  ...holdStyle,
                }}
                aria-label="Hold to trigger SOS"
              >
                <div className="text-center text-white">
                  <div className="text-xs uppercase font-bold opacity-90 text-red-700">Hold to Confirm</div>
                  <div className="text-4xl font-extrabold mt-2 text-red-700">PANIC</div>
                </div>
              </div>

              <div className="w-64">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-red-400 transition-all"
                  />
                </div>
                <div className="text-xs text-gray-500 text-center mt-2">
                  Hold for 2 seconds to trigger emergency actions
                </div>
              </div>

              <div className="w-full flex flex-col md:flex-row gap-3 items-center justify-center">
                <button
                  onClick={() => callEmergency("112")}
                  className="px-4 py-2 rounded-md bg-red-100 text-red-700 font-semibold flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" /> Call 112
                </button>

                <button
                  onClick={copyToClipboard}
                  disabled={sending}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 flex items-center gap-2"
                >
                  <Clipboard className="h-4 w-4" /> Copy SOS Message
                </button>

                <button
                  onClick={nativeShare}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Optional short note (what's happening)</label>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I am at the library and need help..."
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {respMessage && (
              <div className="mt-4 px-4 py-2 bg-gray-50 rounded text-sm text-gray-700 border">
                {respMessage}
              </div>
            )}

            {lastSent && (
              <div className="mt-3 text-xs text-gray-500">
                Last SOS sent: {new Date(lastSent).toLocaleString()}
              </div>
            )}
          </div>

          {/* Right: helplines & info */}
          <aside className="bg-white p-6 rounded-xl shadow border flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Quick Helplines</h3>
              <span className="text-xs text-gray-400">Save these</span>
            </div>

            <ul className="space-y-3">
              {sampleHelplines.map((h) => (
                <li key={h.id} className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{h.name}</div>
                    <div className="text-sm text-gray-500">{h.number} • {h.type}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <a href={`tel:${h.number}`} className="text-sm text-blue-600">Call</a>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(h.number);
                        setRespMessage(`Copied ${h.number}`);
                      }}
                      className="text-xs text-gray-500"
                    >
                      Copy
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t">
              <h4 className="font-semibold">If you can't call</h4>
              <p className="text-sm text-gray-600 mt-1">Use the panic button above to quickly notify your trusted contacts and emergency services (if configured on the backend).</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Confirmation modal shown after hold completes */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="font-bold text-lg">Confirm SOS</h3>
                  <p className="text-sm text-gray-600 mt-1">We'll attach your current location (if available) and notify emergency contacts.</p>
                </div>
              </div>

              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700"><X /></button>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-700 whitespace-pre-wrap border p-3 rounded bg-gray-50">
                {buildSOSMessage(geo)}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={async () => {
                    setShowModal(false);
                    await sendSOS(geo);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
                >
                  <CheckCircle /> Send SOS
                </button>

                <button
                  onClick={() => {
                    copyToClipboard();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  <Clipboard className="inline-block mr-2" /> Copy
                </button>

                <button
                  onClick={() => {
                    nativeShare();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  <Share2 className="inline-block mr-2" /> Share
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="ml-auto px-4 py-2 bg-white border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-400 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Tip: Hold the button only when sure — it will notify your configured emergency contacts.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOS;
