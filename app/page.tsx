"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./styling/login.module.css";

async function checkEmailInDatabase(email: string) {
  const res = await fetch(
    `/submit.php?email=${encodeURIComponent(email.trim().toLowerCase())}`
  );

  if (res.ok) return true;
  if (res.status === 404) return false;
  throw new Error(`Unexpected status  ${res.status}`);
}

const STATE = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loginState, setLoginState] = useState(STATE.IDLE);
  const [message, setMessage] = useState("");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isLoading = loginState === STATE.LOADING;
  const isLoggedIn = loginState === STATE.SUCCESS;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail || isLoading) return;

    setLoginState(STATE.LOADING);
    setMessage("");

    const found = await checkEmailInDatabase(email);

    if (found) {
      setLoginState(STATE.SUCCESS);
      setMessage(`Access granted for ${email}`);
    } else {
      setLoginState(STATE.ERROR);
      setMessage("No account found with that email address.");
    }
  }

  function handleEmailChange(e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >) {
    setEmail(e.target.value);
    // Reset error when user starts typing again
    if (loginState === STATE.ERROR) {
      setLoginState(STATE.IDLE);
      setMessage("");
    }
  }

  function handleGoToAddRecord() {
    router.push("/AddRecord"); // adjust route as needed
  }

  /* Derive input style variant */
  const inputClass = [
    styles.input,
    loginState === STATE.ERROR && styles.inputError,
    loginState === STATE.SUCCESS && styles.inputSuccess,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* ---- Header ---- */}
        <div className={styles.header}>
          <h1 className={styles.title}>Sign in</h1>
          <p className={styles.subtitle}>
            Enter your email to look up your{" "}
            <span className={styles.badge}>$_SESSION</span> record
          </p>
        </div>

        <hr className={styles.divider} />

        {/* ---- Form ---- */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              disabled={isLoggedIn}
              aria-describedby="email-status"
            />

            {/* Inline status message */}
            <span
              id="email-status"
              className={[
                styles.statusMsg,
                loginState === STATE.ERROR && styles.error,
                loginState === STATE.SUCCESS && styles.success,
                loginState === STATE.LOADING && styles.loading,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-live="polite"
            >
              {loginState === STATE.LOADING && (
                <>
                  <span className={styles.spinner} /> Searching database…
                </>
              )}
              {message && loginState !== STATE.LOADING && (
                <>
                  {loginState === STATE.ERROR ? "✗" : "✓"} {message}
                </>
              )}
            </span>
          </div>

          {/* Footer row: hint + button */}
          <div className={styles.footer}>
            <span className={styles.footerHint}>
              POST <span className={styles.accent}>→</span>{" "}
              <span className={styles.accent}>auth.php</span>
            </span>

            <button
              type="submit"
              className={styles.btnLogin}
              disabled={!isValidEmail || isLoading || isLoggedIn}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner} /> Checking…
                </>
              ) : isLoggedIn ? (
                <>✓ Verified</>
              ) : (
                <>Look up email ↗</>
              )}
            </button>
          </div>
        </form>

        {/* ---- Post-login: Add Record button ---- */}
        {isLoggedIn && (
          <div className={styles.addRecordWrap}>
            <p className={styles.addRecordInfo}>
              <span className={styles.dot} />
              Session active — you may now add a new record
            </p>
            <button
              type="button"
              className={styles.btnAddRecord}
              onClick={handleGoToAddRecord}
            >
              <span>Add new record</span>
              <span className={styles.btnRight}>
                /add-record <span>↗</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}