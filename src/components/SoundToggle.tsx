"use client";

import styles from "./SoundToggle.module.css";

type SoundToggleProps = {
  muted: boolean;
  onToggle: () => void;
  labelMuted: string;
  labelUnmuted: string;
  className?: string;
};

export function SoundToggle({
  muted,
  onToggle,
  labelMuted,
  labelUnmuted,
  className,
}: SoundToggleProps) {
  return (
    <button
      type="button"
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-label={muted ? labelMuted : labelUnmuted}
      aria-pressed={!muted}
    >
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path
          className={styles.speakerBody}
          d="M4 9v6h3.5l4.5 4V5l-4.5 4H4z"
        />
        {muted ? (
          <path className={styles.slash} d="M3 3l18 18" />
        ) : (
          <>
            <path className={styles.wave} d="M15 9a4 4 0 0 1 0 6" />
            <path className={styles.wave} d="M17.5 6.5a8 8 0 0 1 0 11" />
          </>
        )}
      </svg>
    </button>
  );
}
