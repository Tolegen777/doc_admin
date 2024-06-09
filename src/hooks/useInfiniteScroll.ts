import React, { useEffect, useState, useRef } from 'react';
import {IGet} from "../types/common.ts";

// Define types for the hook props
type Props<T> = {
    data: IGet<T> | null;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
};

// Hook for implementing infinite scrolling
export const useInfiniteScroll = <T>(props: Props<T>) => {
    // Destructuring props
    const { data, setPage, page } = props;

    // State to store scrolled data
    const [scrolledData, setScrolledData] = useState<T[]>([]);

    // Ref for referencing the scroll container
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Update data when the page number changes
    useEffect(() => {
        console.log('bro')
        if (data?.next) {
            if (page > 1) {
                setScrolledData([...scrolledData, ...data.results]);
            } else {
                setScrolledData(data.results);
            }
        }
    }, [data]);

    // Reset the page when the component is unmounted
    useEffect(() => () => setPage(1), []);

    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            console.log(scrollContainerRef, 'rEF')
            if (!scrollContainerRef.current) return;

            const scrollContainer = scrollContainerRef.current;

            // Calculate the distance to the bottom of the scroll container
            const scrollDistanceToBottom =
                scrollContainer.scrollHeight -
                scrollContainer.clientHeight -
                scrollContainer.scrollTop;

            // Threshold for scrolling, triggering a request for the next page when reached
            const threshold = 1;
            console.log(scrollDistanceToBottom, 'JJJ')

            // Check if the threshold is reached and if there are more pages to load
            if (scrollDistanceToBottom < threshold && data) {
                if (data.next?.length) {
                    setPage(prevState => prevState + 1);
                }
            }
        };

        // Add the scroll event listener
        if (scrollContainerRef?.current) {
            scrollContainerRef.current.addEventListener('scroll', handleScroll);
        }

        // Clean up the event listener when the component is unmounted
        return () => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.removeEventListener(
                    'scroll',
                    handleScroll,
                );
            }
        };
    }, [data]);

    // Return scrolled data and a reference to the scroll container
    return { localData: scrolledData, scrollContainerRef };
};
