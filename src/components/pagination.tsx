"use client";

import styles from "./Pagination.module.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrev,
}: PaginationProps) {
  return (
    <div className={styles.pagination}>
      <span>
        {currentPage} de {totalPages}
      </span>
      <div className={styles.buttons}>
        <button
          className={styles.pageButton}
          onClick={onPrev}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          ‹
        </button>
        <button
          className={styles.pageButton}
          onClick={onNext}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          ›
        </button>
      </div>
    </div>
  );
}

