"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const PANEL_WIDTH_COLLAPSED = 20;
const PANEL_WIDTH_EXPANDED = 400;
const PANEL_WIDTH_EXPANDED_MOBILE = 100;
const PANEL_GAP = 5;
const PANEL_COUNT_DESKTOP = 20;
const PANEL_COUNT_MOBILE = 10;
const BREAKPOINT_MOBILE = 1000;

export default function Spotlight() {
  const trackRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedPanel, setFocusedPanel] = useState(0);

  const panelCount = isMobile ? PANEL_COUNT_MOBILE : PANEL_COUNT_DESKTOP;
  const expandedWidth = isMobile
    ? PANEL_WIDTH_EXPANDED_MOBILE
    : PANEL_WIDTH_EXPANDED;

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setTrackWidth(entry.contentRect.width);
      setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    });
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setFocusedPanel(0);
  }, [panelCount]);

  const getPanelPosition = useCallback(
    (panelIndex) => {
      const totalTrackWidth =
        (panelCount - 1) * (PANEL_WIDTH_COLLAPSED + PANEL_GAP) + expandedWidth;
      const offsetToCenter = (trackWidth - totalTrackWidth) / 2;

      let left = offsetToCenter;
      for (let i = 0; i < panelIndex; i++) {
        const w = i === focusedPanel ? expandedWidth : PANEL_WIDTH_COLLAPSED;
        left += w + PANEL_GAP;
      }

      const width =
        panelIndex === focusedPanel ? expandedWidth : PANEL_WIDTH_COLLAPSED;
      return { left, width };
    },
    [focusedPanel, panelCount, expandedWidth, trackWidth],
  );

  const getFocusIndicatorPosition = useCallback(() => {
    return getPanelPosition(focusedPanel);
  }, [focusedPanel, getPanelPosition]);

  const focusPanel = useCallback((index) => {
    setFocusedPanel(index);
  }, []);

  return (
    <section className="spotlight">
      <div className="spotlight-track" ref={trackRef}>
        <div className="spotlight-panels">
          <div
            className="spotlight-focus-indicator"
            style={getFocusIndicatorPosition()}
          />

          {Array.from({ length: panelCount }, (_, i) => (
            <div
              key={`${isMobile ? "m" : "d"}-${i}`}
              className="spotlight-panel"
              style={getPanelPosition(i)}
              onMouseEnter={!isMobile ? () => focusPanel(i) : undefined}
              onClick={isMobile ? () => focusPanel(i) : undefined}
            >
              <img src={`/spotlight/spotlight-${i + 1}.jpg`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
