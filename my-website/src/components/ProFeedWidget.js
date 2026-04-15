import React, { useCallback, useEffect, useMemo, useState } from "react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation } from "@docusaurus/router";

const SECRETS_KEY = "prodoc_feedback_secrets";

function readSecrets() {
  try {
    const raw = window.localStorage.getItem(SECRETS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function mergeSecret(id, secret) {
  const next = { ...readSecrets(), [id]: secret };
  window.localStorage.setItem(SECRETS_KEY, JSON.stringify(next));
}

function getOrCreateVisitorId() {
  const key = "prodoc_visitor_id";
  try {
    let id = window.localStorage.getItem(key);
    if (!id) {
      id = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      window.localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

function sectionFromHash(hash) {
  const h = (hash || "").replace(/^#/, "").trim();
  return h || null;
}

export function ProFeedWidget() {
  const { siteConfig } = useDocusaurusContext();
  const { pathname, hash } = useLocation();

  const appUrl = siteConfig.customFields?.appUrl || "http://localhost:3000";
  const endpoint = `${appUrl.replace(/\/$/, "")}/api/feedback`;

  const [open, setOpen] = useState(false);
  const [section, setSection] = useState(sectionFromHash(hash));
  const [sectionManual, setSectionManual] = useState("");
  const [headings, setHeadings] = useState([]);

  const [rating, setRating] = useState(null); // 1 | -1
  const [stars, setStars] = useState(null); // 1..5
  const [message, setMessage] = useState("");
  const [taggedAuthor, setTaggedAuthor] = useState("");
  const [taggedTeam, setTaggedTeam] = useState("");

  const [highlights, setHighlights] = useState([]);
  const [captureText, setCaptureText] = useState(false);

  const [files, setFiles] = useState([]);
  const [state, setState] = useState("idle"); // idle | submitting | success | error
  const [errorText, setErrorText] = useState(null);

  useEffect(() => {
    setSection(sectionFromHash(hash));
  }, [hash, pathname]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const hs = [...document.querySelectorAll("h2[id], h3[id]")].map((el) => ({
        id: el.id,
        text: (el.textContent || "").trim() || el.id,
      }));
      setHeadings(hs);
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!captureText) return;
    const onMouseUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (!text) return;
      setHighlights((h) => [...h, { kind: "text", quote: text.slice(0, 2000), note: "" }]);
      setCaptureText(false);
      sel?.removeAllRanges?.();
    };
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [captureText]);

  const effectiveSection = sectionManual || section;
  const sectionLabel = useMemo(() => {
    const anchor = sectionManual || section;
    return anchor ? `#${anchor}` : "Whole page";
  }, [section, sectionManual]);

  const resetForm = useCallback(() => {
    setRating(null);
    setStars(null);
    setMessage("");
    setTaggedAuthor("");
    setTaggedTeam("");
    setHighlights([]);
    setFiles([]);
    setState("idle");
    setErrorText(null);
    setCaptureText(false);
  }, []);

  const applySectionAnchor = useCallback((anchor) => {
    const next = (anchor || "").trim().replace(/^#/, "");
    setSectionManual(next);
    window.location.hash = next ? `#${next}` : "";
  }, []);

  const removeHighlight = useCallback((idx) => {
    setHighlights((h) => h.filter((_, i) => i !== idx));
  }, []);

  const removeFile = useCallback((idx) => {
    setFiles((f) => f.filter((_, i) => i !== idx));
  }, []);

  const submit = useCallback(async () => {
    if (rating === null && stars === null) {
      setErrorText("Choose helpful / not helpful and/or a star rating.");
      return;
    }
    setState("submitting");
    setErrorText(null);
    try {
      const fd = new FormData();
      fd.append("page_path", pathname);
      fd.append("section_anchor", effectiveSection || "");
      fd.append("body", (message || "").trim());
      fd.append("visitor_session", getOrCreateVisitorId());
      fd.append("highlights", JSON.stringify(highlights));
      fd.append("tagged_author", (taggedAuthor || "").trim());
      fd.append("tagged_team", (taggedTeam || "").trim());
      if (rating !== null) fd.append("rating", String(rating));
      if (stars !== null) fd.append("star_rating", String(stars));
      files.forEach((f) => fd.append("files", f));

      const res = await fetch(endpoint, { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setState("error");
        setErrorText((data && data.error) || "Could not send feedback.");
        return;
      }
      if (data?.id && data?.editSecret) {
        mergeSecret(data.id, data.editSecret);
      }
      setState("success");
      setRating(null);
      setStars(null);
      setMessage("");
      setHighlights([]);
      setFiles([]);
    } catch {
      setState("error");
      setErrorText("Network error. Try again.");
    }
  }, [endpoint, effectiveSection, files, highlights, message, pathname, rating, stars, taggedAuthor, taggedTeam]);

  return (
    <div style={{ pointerEvents: "none", position: "fixed", inset: "auto 0 0 0", zIndex: 9999, display: "flex", justifyContent: "flex-end", padding: 16 }}>
      <div style={{ pointerEvents: "auto", width: "100%", maxWidth: 520 }}>
        {open ? (
          <div style={{ maxHeight: "85vh", overflowY: "auto", borderRadius: 16, border: "1px solid rgba(148,163,184,0.35)", background: "var(--ifm-background-color)", boxShadow: "0 10px 30px rgba(0,0,0,0.18)", padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>ProFeed</div>
                <div style={{ marginTop: 4, fontSize: 12, opacity: 0.8 }}>
                  Section: <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{sectionLabel}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                style={{ fontSize: 12, background: "transparent", border: "none", padding: "6px 8px", cursor: "pointer", opacity: 0.8 }}
              >
                Close
              </button>
            </div>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>Page quality (stars)</div>
                <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setStars(n)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        border: "1px solid rgba(148,163,184,0.4)",
                        background: stars === n ? "rgba(245,158,11,0.12)" : "transparent",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                      aria-label={`${n} stars`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>Helpfulness</div>
                <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setRating(1)}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      border: "1px solid rgba(148,163,184,0.4)",
                      background: rating === 1 ? "rgba(16,185,129,0.12)" : "transparent",
                      padding: "8px 10px",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    Helpful
                  </button>
                  <button
                    type="button"
                    onClick={() => setRating(-1)}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      border: "1px solid rgba(148,163,184,0.4)",
                      background: rating === -1 ? "rgba(244,63,94,0.10)" : "transparent",
                      padding: "8px 10px",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    Not helpful
                  </button>
                </div>
              </div>
            </div>

            <label style={{ marginTop: 12, display: "block", fontSize: 12, fontWeight: 600, opacity: 0.85 }}>
              Target section
              <select
                value={sectionManual || section || ""}
                onChange={(e) => applySectionAnchor(e.target.value)}
                style={{ marginTop: 6, width: "100%", borderRadius: 10, border: "1px solid rgba(148,163,184,0.4)", background: "transparent", padding: "8px 10px" }}
              >
                <option value="">Whole page (no anchor)</option>
                {headings.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.text}
                  </option>
                ))}
              </select>
            </label>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, opacity: 0.85 }}>
                Tag author
                <input
                  value={taggedAuthor}
                  onChange={(e) => setTaggedAuthor(e.target.value)}
                  placeholder="e.g., Linga Raj M"
                  style={{ marginTop: 6, width: "100%", borderRadius: 10, border: "1px solid rgba(148,163,184,0.4)", background: "transparent", padding: "8px 10px" }}
                />
              </label>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, opacity: 0.85 }}>
                Tag team
                <input
                  value={taggedTeam}
                  onChange={(e) => setTaggedTeam(e.target.value)}
                  placeholder="e.g., Docs / Product"
                  style={{ marginTop: 6, width: "100%", borderRadius: 10, border: "1px solid rgba(148,163,184,0.4)", background: "transparent", padding: "8px 10px" }}
                />
              </label>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setCaptureText((v) => !v)}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.4)",
                  background: captureText ? "rgba(99,102,241,0.12)" : "transparent",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {captureText ? "Selecting text…" : "Highlight selected text"}
              </button>
            </div>

            {highlights.length ? (
              <div style={{ marginTop: 12, borderRadius: 14, border: "1px solid rgba(148,163,184,0.25)", padding: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.9 }}>Highlights</div>
                <div style={{ marginTop: 8, display: "grid", gap: 10 }}>
                  {highlights.map((h, idx) => (
                    <div key={`${idx}-${h.kind}`} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>{h.quote}</div>
                        <input
                          value={h.note || ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setHighlights((list) =>
                              list.map((item, i) => (i === idx ? { ...item, note: v } : item)),
                            );
                          }}
                          placeholder="Optional note"
                          style={{ marginTop: 6, width: "100%", borderRadius: 10, border: "1px solid rgba(148,163,184,0.35)", background: "transparent", padding: "6px 10px", fontSize: 12 }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeHighlight(idx)}
                        style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ifm-color-danger)", fontSize: 12, fontWeight: 700 }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <label style={{ marginTop: 12, display: "block", fontSize: 12, fontWeight: 600, opacity: 0.85 }}>
              Files & screenshots
              <input
                type="file"
                multiple
                accept="image/*,application/pdf,text/plain"
                onChange={(e) => {
                  const list = e.target.files ? [...e.target.files] : [];
                  setFiles((f) => [...f, ...list].slice(0, 8));
                  e.target.value = "";
                }}
                style={{ marginTop: 6, width: "100%" }}
              />
            </label>
            {files.length ? (
              <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                {files.map((f, idx) => (
                  <div key={`${f.name}-${idx}`} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ifm-color-danger)", fontSize: 12, fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <label style={{ marginTop: 12, display: "block", fontSize: 12, fontWeight: 600, opacity: 0.85 }}>
              Message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Context, severity, or what should change…"
                style={{ marginTop: 6, width: "100%", resize: "vertical", borderRadius: 10, border: "1px solid rgba(148,163,184,0.4)", background: "transparent", padding: "8px 10px", fontSize: 13 }}
              />
            </label>

            {errorText ? <div style={{ marginTop: 8, color: "var(--ifm-color-danger)", fontSize: 12 }}>{errorText}</div> : null}
            {state === "success" ? (
              <div style={{ marginTop: 8, color: "var(--ifm-color-success)", fontSize: 12 }}>
                Thanks — feedback saved. You can review it in ProFeed.
              </div>
            ) : null}

            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={resetForm}
                style={{ borderRadius: 10, border: "1px solid rgba(148,163,184,0.4)", background: "transparent", padding: "8px 12px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={state === "submitting"}
                style={{ borderRadius: 10, border: "none", background: "var(--ifm-color-primary)", color: "var(--ifm-background-color)", padding: "8px 12px", cursor: "pointer", fontWeight: 800, fontSize: 12, opacity: state === "submitting" ? 0.65 : 1 }}
              >
                {state === "submitting" ? "Sending…" : "Send feedback"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{ marginLeft: "auto", borderRadius: 999, border: "1px solid rgba(148,163,184,0.35)", background: "var(--ifm-background-color)", padding: "10px 14px", cursor: "pointer", fontWeight: 800 }}
          >
            Feedback
          </button>
        )}
      </div>
    </div>
  );
}

