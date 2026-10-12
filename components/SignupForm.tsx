"use client";

import { useState, type FormEvent } from "react";
import { track } from "@/lib/track";

type Props = {
  location: "hero" | "waitlist";
  night?: boolean;
};

type Status = "idle" | "sending" | "done" | "error";

export default function SignupForm({ location, night = false }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const id = `email-${location}`;
  const done = status === "done";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    setStatus("sending");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, location }),
      });
      if (!res.ok) throw new Error(`waitlist signup failed: ${res.status}`);
      track("Lead", { content_name: "waitlist", location });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      className={`signup${night ? " signup--night" : ""}${done ? " is-done" : ""}`}
      data-form="email-capture"
      data-location={location}
      onSubmit={handleSubmit}
    >
      <label className="visually-hidden" htmlFor={id}>
        email address
      </label>
      <input
        className="signup__input"
        id={id}
        type="email"
        name="email"
        placeholder="your@email.com"
        autoComplete="email"
        required
        readOnly={done || status === "sending"}
      />
      <button className="signup__btn" type="submit" disabled={done || status === "sending"}>
        {status === "sending" ? "Joining…" : "Join the waitlist"} <span aria-hidden="true">→</span>
      </button>
      <p className="signup__success" hidden={!done}>
        You&apos;re on the list. We&apos;ll email you the day we open. Start thinking about which show goes first.
      </p>
      <p className="signup__error" role="alert" hidden={status !== "error"}>
        That didn&apos;t go through. Please try again in a moment.
      </p>
    </form>
  );
}
