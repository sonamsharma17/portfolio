"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface JourneyContextType {
  hasBoarded: boolean;
  currentStation: string;
  visitedStations: string[];
  journeyStartTime: number | null;
  setBoarded: () => void;
  setCurrentStation: (station: string) => void;
  markStationVisited: (station: string) => void;
}

const JourneyContext = createContext<JourneyContextType>({
  hasBoarded: false,
  currentStation: "home",
  visitedStations: [],
  journeyStartTime: null,
  setBoarded: () => {},
  setCurrentStation: () => {},
  markStationVisited: () => {},
});

export const useJourneyContext = () => useContext(JourneyContext);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [hasBoarded, setHasBoarded] = useState(false);
  const [currentStation, setCurrentStationState] = useState("home");
  const [visitedStations, setVisitedStations] = useState<string[]>([]);
  const [journeyStartTime, setJourneyStartTime] = useState<number | null>(null);

  const setBoarded = useCallback(() => {
    setHasBoarded(true);
    setJourneyStartTime(Date.now());
  }, []);

  const setCurrentStation = useCallback((station: string) => {
    setCurrentStationState(station);
  }, []);

  const markStationVisited = useCallback((station: string) => {
    setVisitedStations((prev) => {
      if (prev.includes(station)) return prev;
      return [...prev, station];
    });
  }, []);

  return (
    <JourneyContext.Provider
      value={{
        hasBoarded,
        currentStation,
        visitedStations,
        journeyStartTime,
        setBoarded,
        setCurrentStation,
        markStationVisited,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}
