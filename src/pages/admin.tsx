import { useState, useEffect, useCallback } from "react";
import { Lock, Loader2, RefreshCw, LogOut, Inbox, Mail, AlertCircle } from "lucide-react";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const STORAGE_KEY = "portfolio-admin-key";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Admin() {
  const [passphrase, setPassphrase] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  const fetchMessages = useCallback(
    async (key: string) => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(`${apiBase}/api/admin/contact-messages`, {
          headers: { Authorization: `Bearer ${key}` },
        });
        const json = (await res.json()) as {
          messages?: ContactMessage[];
          error?: string;
        };
        if (!res.ok) {
          if (res.status === 401) {
            sessionStorage.removeItem(STORAGE_KEY);
            setAuthed(false);
            throw new Error("Incorrect passphrase. Please try again.");
          }
          throw new Error(json.error ?? "Failed to load messages.");
        }
        sessionStorage.setItem(STORAGE_KEY, key);
        setMessages(json.messages ?? []);
        setAuthed(true);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [apiBase],
  );

  // Restore session if a passphrase was saved this browser session
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPassphrase(saved);
      void fetchMessages(saved);
    }
  }, [fetchMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;
    void fetchMessages(passphrase.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPassphrase("");
    setMessages([]);
    setAuthed(false);
    setErrorMsg("");
  };

  // Locked / login view
  if (!authed) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-sm"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-xl font-mono font-bold">
              <span className="text-accent">/</span> message inbox
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your passphrase to view contact submissions.
            </p>
          </div>

          <label
            htmlFor="passphrase"
            className="text-sm font-mono text-muted-foreground"
          >
            Passphrase
          </label>
          <input
            id="passphrase"
            type="password"
            autoFocus
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="••••••••"
            data-testid="input-passphrase"
            className="w-full mt-1.5 mb-4 bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
          />

          {errorMsg && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            data-testid="btn-unlock"
            className="flex w-full items-center justify-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-mono text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Unlocking…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Unlock
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // Authed view
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-mono font-bold">
              <span className="text-accent">/</span> message inbox
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {messages.length}{" "}
              {messages.length === 1 ? "message" : "messages"} received
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => void fetchMessages(passphrase)}
              disabled={loading}
              data-testid="btn-refresh"
              aria-label="Refresh"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-mono hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              data-testid="btn-logout"
              aria-label="Lock"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-mono hover:border-accent hover:text-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Lock
            </button>
          </div>
        </header>

        {errorMsg && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-border rounded-2xl">
            <Inbox className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-mono text-sm">
              No messages yet.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4" data-testid="list-messages">
            {messages.map((msg) => (
              <li
                key={msg.id}
                data-testid={`message-${msg.id}`}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      {msg.name}
                    </span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="flex items-center gap-1.5 text-sm text-accent hover:underline break-all"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      {msg.email}
                    </a>
                  </div>
                  <time className="text-xs font-mono text-muted-foreground shrink-0">
                    {formatDate(msg.createdAt)}
                  </time>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                  {msg.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
