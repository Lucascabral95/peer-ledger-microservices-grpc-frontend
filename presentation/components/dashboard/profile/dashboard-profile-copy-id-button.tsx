"use client";

import { useState } from "react";

import styles from "./dashboard-profile.module.scss";

interface DashboardProfileCopyIdButtonProps {
  userId: string;
}

export function DashboardProfileCopyIdButton({
  userId,
}: DashboardProfileCopyIdButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(userId);
      } else {
        copyWithFallback(userId);
      }

      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      copyWithFallback(userId);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      className={styles.copyIdButton}
      onClick={handleCopy}
      aria-label="Copiar ID de usuario"
    >
      <span aria-hidden="true">ID</span>
      {isCopied ? "Copiado" : "Copiar"}
    </button>
  );
}

function copyWithFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
