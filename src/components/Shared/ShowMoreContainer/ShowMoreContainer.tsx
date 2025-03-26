"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

interface PropsType {
  children: ReactNode;
}

const SHOW_MORE_CONTAINER_MAX_HEIGHT = 40;

const ShowMoreContainer = ({ children }: PropsType) => {
  const [isOverflow, setIsOverflow] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const current = ref.current;
      if (current) {
        const { scrollHeight } = current;
        setIsOverflow(scrollHeight > SHOW_MORE_CONTAINER_MAX_HEIGHT);
      }
    };

    checkOverflow();

    // Перепроверка переполнения при изменении размеров окна
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [children]);

  return (
    <div className={styles.container}>
      <div
        ref={ref}
        className={clsx(styles.text, {
          [styles.text_full]: showMore,
          [styles.text_hideLines]: isOverflow && !showMore,
        })}
      >
        {children}
      </div>
      {isOverflow && (
        <p
          className={clsx(styles.moreButton, {
            [styles.moreButton_open]: showMore,
          })}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Скрыть" : "Показать еще"}
        </p>
      )}
    </div>
  );
};

export default ShowMoreContainer;
