"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
          <Image
          src="/contactLogo.png"
          alt="Contact Logo"
          width={60}
          height={60}
        />
        <span className={styles.circle}></span>
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
