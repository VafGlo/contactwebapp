"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <span className={styles.circle}></span>
        <h2>Contact app</h2>
      </div>
      <ul className={styles.navLinks}>
        <li className={pathname === "/" ? styles.active : ""}>
          <Link href="/">Overview</Link>
        </li>
        <li className={pathname === "/contacts" ? styles.active : ""}>
          <Link href="/contacts">Contacts</Link>
        </li>
        <li className={pathname === "/favorites" ? styles.active : ""}>
          <Link href="/favorites">Favorites</Link>
        </li>
        <li>
          <Link href="/new" className={styles.newBtn}>+ NEW</Link>
        </li>
      </ul>
    </nav>
  );
}
