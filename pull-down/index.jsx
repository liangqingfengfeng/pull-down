import React, { useEffect, useRef, useState, useCallback } from 'react';
import Loading from '../loading-cat';
import './index.less';

/**
 * 下拉刷新组件
 * @param {children, stop: 回弹停留位置, loadingTime: 加载时间, refresh: promise 回调函数}
 * @returns JSX.Element
 */
function ScrollView({ children, stop = 50, loadingTime = 300, refresh }) {
  const viewRef = useRef(null);
  const [startY, setStartY] = useState(0);
  const [top, setTop] = useState(0);
  const [dynamic, setDynamic] = useState(false);

  const handleTouchStart = useCallback(e => {
    const [touches = {}] = e.changedTouches;
    const { pageY } = touches;

    setStartY(pageY);
  }, []);

  const handleTouchMove = useCallback(e => {
    const [touches] = e.changedTouches;
    const { pageY } = touches;

    if (viewRef?.current) {
      const { scrollTop } = viewRef.current;
      const differ = pageY - startY;

      if (scrollTop === 0 && differ > 0) {
        const _diff = top > stop ? stop + Math.log10(differ) : top + 2;
        setTop(_diff);
      }
    }
  }, [startY, top, stop]);

  const handleTouchEnd = useCallback(e => {
    const [touches] = e.changedTouches;
    const { pageY } = touches;

    if (viewRef?.current) {
      const { scrollTop } = viewRef.current;
      const differ = pageY - startY;

      if (scrollTop === 0 && differ > stop && differ > 20) { // 下拉超过阈值
        setTop(stop);
        setDynamic(true);
        refresh().then(() => {
          setTimeout(() => {
            setTop(0);
            setDynamic(false);
          }, loadingTime);
        }).catch(() => {
          setTimeout(() => {
            setTop(0);
            setDynamic(false);
          }, loadingTime);
        });
      } else {
        setTop(0);
      }
    }
  }, [stop, startY, loadingTime, refresh]);

  useEffect(() => {
    const view = viewRef?.current;

    if (view) {
      view.addEventListener('touchstart', handleTouchStart, { passive: false });
      view.addEventListener('touchmove', handleTouchMove, { passive: false });
      view.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
    return () => {
      view.removeEventListener('touchstart', handleTouchStart, { passive: false });
      view.removeEventListener('touchmove', handleTouchMove, { passive: false });
      view.removeEventListener('touchend', handleTouchEnd, { passive: false });
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div className="_scroll-view" ref={viewRef} style={{ transform: `translate3d(0px, ${top}px, 0px)` }}>
      <Loading loadingTop={top} dynamic={dynamic} />
      {children}
    </div>
  );
}

export default ScrollView;