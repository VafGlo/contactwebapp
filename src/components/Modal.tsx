"use client";
import { ReactNode } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
