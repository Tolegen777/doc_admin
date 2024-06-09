import { ReactNode, RefObject } from 'react';
import styles from './styles.module.scss';

type Props = {
    scrollContainerRef: RefObject<HTMLDivElement>;
    children: ReactNode;
};
const InfiniteScrollingContentWrapper = ({
    scrollContainerRef,
    children,
}: Props) => {
    return (
        <div ref={scrollContainerRef} className={styles.container}>
            {children}
        </div>
    );
};

export default InfiniteScrollingContentWrapper;
