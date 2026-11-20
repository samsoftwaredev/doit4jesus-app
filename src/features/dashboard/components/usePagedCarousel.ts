import { useCallback, useEffect, useRef, useState } from "react";
import type { ScrollView, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

/**
 * Shared paging state for horizontal carousels: the selected page follows the scroll position while swiping,
 * indicator taps scroll to their page, and the selection stays aligned when the viewport width changes.
 */
export function usePagedCarousel(pageCount: number) {
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedPageRef = useRef(0);
  const targetPageRef = useRef<number | null>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);

  const select = useCallback((page: number) => {
    selectedPageRef.current = page;
    setSelectedPage(page);
  }, []);

  const clamp = useCallback((page: number) => Math.min(Math.max(page, 0), pageCount - 1), [pageCount]);

  /** Stores the actual viewport width so each page occupies the complete carousel. */
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth > 0) setPageWidth(nextWidth);
  }, []);

  /** Tracks the swipe live; ignores in-flight positions while an indicator-initiated scroll is animating. */
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageWidth <= 0) return;
      const offset = event.nativeEvent.contentOffset.x;
      if (targetPageRef.current !== null) {
        if (Math.abs(offset - targetPageRef.current * pageWidth) < 2) targetPageRef.current = null;
        return;
      }
      const page = clamp(Math.round(offset / pageWidth));
      if (page !== selectedPageRef.current) select(page);
    },
    [clamp, pageWidth, select],
  );

  /** Settles the selection once any swipe or animated scroll finishes. */
  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageWidth <= 0) return;
      targetPageRef.current = null;
      select(clamp(Math.round(event.nativeEvent.contentOffset.x / pageWidth)));
    },
    [clamp, pageWidth, select],
  );

  /** Scrolls to a page (indicator tap) and highlights it immediately. */
  const showPage = useCallback(
    (index: number) => {
      const page = clamp(index);
      select(page);
      if (pageWidth > 0) {
        targetPageRef.current = page;
        scrollViewRef.current?.scrollTo?.({ animated: true, x: page * pageWidth, y: 0 });
      }
    },
    [clamp, pageWidth, select],
  );

  useEffect(
    /** Keeps the selected page aligned when rotation or responsive layout changes the width. */
    function realignSelectedPage() {
      if (pageWidth > 0) {
        targetPageRef.current = null;
        scrollViewRef.current?.scrollTo?.({ animated: false, x: selectedPageRef.current * pageWidth, y: 0 });
      }
    },
    [pageWidth],
  );

  return { onLayout, onScroll, onScrollEnd, pageWidth, scrollViewRef, selectedPage, showPage };
}
