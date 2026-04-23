"use client";

import { useState, FormEvent } from "react";
import styles from '../styling/lobby.module.css';

type Status = "active" | "inactive" | "pending";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  category: string;
  status: Status;
  notes: string;
}

export default function AddRecordPage() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    category: "",
    status: "active",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: Status) => {
    setForm((prev) => ({ ...prev, status: value }));
  };

  const handleClear = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      category: "",
      status: "active",
      notes: "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // POST to submit.php — mirrors the PHP $_POST behavior shown in the design
    const body = new URLSearchParams({
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      age: form.age,
      category: form.category,
      status: form.status,
      notes: form.notes,
    });

    try {
      const res = await fetch("/submit.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (res.ok) {
        alert("Record submitted successfully!");
        handleClear();
      } else {
        alert(`Server responded with status ${res.status}`);
      }
    } catch (err) {
      alert(`Request failed: ${err}`);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
 
        {/* ── Header ── */}
        <h1 className={styles.cardTitle}>Add new record</h1>
        <p className={styles.cardSubtitle}>
          Fields map directly to your PHP{" "}
          <span className={styles.codeTag}>$_POST</span> variables
        </p>
 
        <hr className={styles.divider} />
 
        <form onSubmit={handleSubmit} noValidate>
 
          {/* ── Name Row ── */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="firstName">First Name</label>
              <input
                className={styles.input}
                id="firstName"
                type="text"
                name="firstName"
                placeholder="e.g. John"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="lastName">Last Name</label>
              <input
                className={styles.input}
                id="lastName"
                type="text"
                name="lastName"
                placeholder="e.g. Doe"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
 
          {/* ── Email ── */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              className={styles.input}
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
 
          {/* ── Age & Category Row ── */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="age">Age</label>
              <input
                className={styles.input}
                id="age"
                type="number"
                name="age"
                placeholder="25"
                min={0}
                max={150}
                value={form.age}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="category">Category</label>
              <select
                className={styles.select}
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="guest">Guest</option>
              </select>
            </div>
          </div>
 
          {/* ── Status ── */}
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <div className={styles.radioGroup}>
              {(["active", "inactive", "pending"] as Status[]).map((s) => (
                <label key={s} className={styles.radioLabel}>
                  <input
                    className={styles.radioInput}
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => handleStatusChange(s)}
                  />
                  {s.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
 
          {/* ── Notes ── */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="notes">Notes</label>
            <textarea
              className={styles.textarea}
              id="notes"
              name="notes"
              placeholder="Optional notes about this record..."
              value={form.notes}
              onChange={handleChange}
            />
          </div>
 
          <hr className={styles.divider} />
 
          {/* ── Footer ── */}
          <div className={styles.footer}>
            <span className={styles.postHint}>
              POST →{" "}
              <a href="/submit.php" target="_blank" rel="noopener noreferrer">
                submit.php
              </a>
            </span>
            <div className={styles.btnGroup}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnClear}`}
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnSubmit}`}
              >
                Submit record
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </button>
            </div>
          </div>
 
        </form>
      </div>
    </div>
  );
}