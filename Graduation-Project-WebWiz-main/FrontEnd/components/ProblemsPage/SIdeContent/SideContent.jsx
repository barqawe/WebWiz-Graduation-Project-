import styles from "./SideContent.module.scss";
import Link from "next/link";

const SideContent = () => {
  return (
    <div className={styles.sideContent}>
      <div className={styles.helpfulLinksContainer}>
        <h2 className={styles.title}>Helpful Links</h2>
        <ul className={styles.linksList}>
          <li className={styles.linkItem}>
            <a
              href="https://developer.mozilla.org/en-US/"
              className={styles.link}
            >
              MDN Docs
            </a>
          </li>
          <li className={styles.linkItem}>
            <a href="https://css-tricks.com/" className={styles.link}>
              CSS Tricks
            </a>
          </li>
          <li className={styles.linkItem}>
            <a href="https://javascript.info/" className={styles.link}>
              JavaScript Info
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideContent;
