"use client";

import { useState, type FormEvent } from "react";
import { track } from "@/lib/track";

type Props = {
  location: "hero" | "waitlist";
  night?: boolean;
};

export default function SignupForm({ location, night = false }: Props) {
  const [done, setDone] = useState(false);
  const id = `email-${location}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: send the email address to the email provider.
    track("Lead", { content_name: "waitlist", location });
    setDone(true);
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
        readOnly={done}
      />
      <button className="signup__btn" type="submit" disabled={done}>
        Join the waitlist <span aria-hidden="true">→</span>
      </button>
      <p className="signup__success" hidden={!done}>
        You&apos;re on the list. We&apos;ll email you the day we open. Start thinking about which show goes first.
      </p>
    </form>
  );
}
