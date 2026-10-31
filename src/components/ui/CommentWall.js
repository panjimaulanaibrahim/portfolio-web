"use client";

// Public comment wall in the Contact section: visitors leave a name and a message,
// and it appears right away for everyone. Nothing is sent by email.
// Panji removes unwanted comments in the Firebase console (see src/lib/comments.js).

import { useEffect, useState } from "react";
import { commentsEnabled } from "@/data/firebaseConfig";

const NAME_MAX = 40;
const MESSAGE_MAX = 500;
const COOLDOWN_MS = 30_000; // one comment per 30 seconds from the same browser
const COOLDOWN_KEY = "pmi-last-comment";

const fieldClass =
  "rounded-[10px] border border-[#22304f] bg-panel px-3.5 py-3 text-[15px] text-fg placeholder:text-faint focus:border-accent-light focus:outline-none disabled:opacity-60";

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function timeAgo(date) {
  if (!date) return "just now";
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const steps = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Infinity, "year"],
  ];
  let value = seconds;
  for (const [size, unit] of steps) {
    if (Math.abs(value) < size) return unit === "second" ? "just now" : relative.format(value, unit);
    value = Math.round(value / size);
  }
  return "";
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function CommentWall() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(commentsEnabled);
  const [status, setStatus] = useState("idle"); // idle | posting | posted | error | wait | loadError
  const [messageLength, setMessageLength] = useState(0);

  useEffect(() => {
    if (!commentsEnabled) return;
    let cancelled = false;
    import("@/lib/comments")
      .then(({ loadComments }) => loadComments())
      .then((list) => {
        if (!cancelled) setComments(list);
      })
      .catch(() => {
        if (!cancelled) setStatus("loadError");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return; // spam trap filled in by a bot
    const name = String(data.get("name") || "").trim().slice(0, NAME_MAX);
    const message = String(data.get("message") || "").trim().slice(0, MESSAGE_MAX);
    if (!name || !message) return;

    let last = 0;
    try {
      last = Number(localStorage.getItem(COOLDOWN_KEY)) || 0;
    } catch {
      last = 0;
    }
    if (Date.now() - last < COOLDOWN_MS) {
      setStatus("wait");
      return;
    }

    setStatus("posting");
    try {
      const { postComment } = await import("@/lib/comments");
      const id = await postComment(name, message);
      setComments((list) => [{ id, name, message, createdAt: new Date() }, ...list]);
      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {
        // storage blocked: no cooldown, the database rules still limit what can be posted
      }
      form.reset();
      setMessageLength(0);
      setStatus("posted");
    } catch {
      setStatus("error");
    }
  }

  const disabled = !commentsEnabled || status === "posting";

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-panel/90 p-6 md:p-7">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-[22px] font-semibold text-heading">Leave a comment</h3>
        <p className="text-sm text-faint">
          {commentsEnabled ? "Comments are public and appear below right away." : "Comments open soon."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
        {/* Hidden spam trap: real visitors never fill this in */}
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <label className="flex flex-col gap-2 text-[13px] font-medium text-muted">
          Name
          <input
            id="comment-name"
            name="name"
            type="text"
            required
            maxLength={NAME_MAX}
            autoComplete="name"
            placeholder="Your name"
            disabled={disabled}
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-2 text-[13px] font-medium text-muted">
          <span className="flex justify-between">
            Comment
            <span className="font-mono text-xs text-faint tabular-nums">
              {messageLength}/{MESSAGE_MAX}
            </span>
          </span>
          <textarea
            id="comment-message"
            name="message"
            rows={4}
            required
            maxLength={MESSAGE_MAX}
            placeholder="Say hi, share feedback, or ask a question"
            disabled={disabled}
            onChange={(event) => setMessageLength(event.target.value.length)}
            className={`${fieldClass} resize-y`}
          />
        </label>

        <button
          type="submit"
          disabled={disabled}
          className="min-h-12 rounded-[10px] bg-accent px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#1d4fd8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "posting" ? "Posting..." : "Post comment"}
        </button>

        <p aria-live="polite" className="min-h-5 text-sm">
          {status === "posted" && <span className="text-success">Thanks! Your comment is now on the wall.</span>}
          {status === "wait" && <span className="text-muted">Please wait a few seconds before posting again.</span>}
          {status === "error" && (
            <span className="text-[#f87171]">Your comment could not be posted. Please try again in a moment.</span>
          )}
        </p>
      </form>

      {commentsEnabled && (
        <div className="flex flex-col gap-3 border-t border-line pt-5">
          <p className="font-mono text-xs tracking-[0.14em] text-faint">
            {loading ? "LOADING COMMENTS..." : `${comments.length} COMMENT${comments.length === 1 ? "" : "S"}`}
          </p>
          {status === "loadError" && <p className="text-sm text-[#f87171]">Comments could not be loaded right now.</p>}
          {!loading && comments.length === 0 && status !== "loadError" && (
            <p className="text-sm text-muted">No comments yet. Be the first to say hi.</p>
          )}
          <ul className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3 rounded-xl border border-line bg-surface/70 p-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chip font-mono text-xs font-semibold text-accent-light"
                >
                  {initials(comment.name)}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="font-semibold text-heading">{comment.name}</span>
                    <span className="text-xs text-faint">{timeAgo(comment.createdAt)}</span>
                  </p>
                  <p className="whitespace-pre-line break-words text-[15px] leading-relaxed text-body">{comment.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
