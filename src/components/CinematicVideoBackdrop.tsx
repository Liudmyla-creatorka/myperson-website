import Image from "next/image";

import styles from "./CinematicVideoBackdrop.module.css";

// Either the looping reel footage, or a frozen still frame of it — never
// both. The still option exists for sections where the moving loop reads as
// too much visual noise behind foreground content (see CampaignsShowcase /
// CaseStudyBises), while keeping the exact same dimmed-wash treatment so the
// cinema motif still reads as one continuous strip across sections.
type CinematicVideoBackdropProps =
  | { kind: "video"; videoSrc: string }
  | { kind: "image"; imageSrc: string };

export function CinematicVideoBackdrop(props: CinematicVideoBackdropProps) {
  return (
    <>
      {props.kind === "video" ? (
        <video
          className={styles.media}
          src={props.videoSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
      ) : (
        <Image
          src={props.imageSrc}
          alt=""
          fill
          sizes="100vw"
          className={styles.media}
          style={{ objectFit: "cover" }}
          aria-hidden="true"
        />
      )}
      <div className={styles.overlay} aria-hidden="true" />
    </>
  );
}
