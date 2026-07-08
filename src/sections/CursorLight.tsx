"use client";

// Disabled pending a fresh diagnosis next session — every prior committed
// version (Hero's original, and the z-index/Fragment-sibling fixes in
// 6d1744f) was reported broken/seamed once integrated with Usługi/Metoda,
// so there is no earlier commit to revert to that isn't already known-bad.
// Inert is the safe baseline until it's rebuilt.
export function CursorLight() {
  return null;
}
