"use client";

import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useJourneyContext } from "@/context/JourneyContext";
import LoadingScreen from "@/components/loading/LoadingScreen";
import HeroStation from "@/components/hero/HeroStation";
import BoardingSequence from "@/components/boarding/BoardingSequence";
import SkillsFreightYard from "@/components/stations/SkillsFreightYard";
import EducationExpress from "@/components/stations/EducationExpress";
import ProjectMetro from "@/components/stations/ProjectMetro";
import HackathonHub from "@/components/stations/HackathonHub";
import ExperienceJunction from "@/components/stations/ExperienceJunction";
import AchievementStation from "@/components/stations/AchievementStation";
import LanguagesDepot from "@/components/stations/LanguagesDepot";
import ContactTerminal from "@/components/stations/ContactTerminal";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { hasBoarded } = useJourneyContext();

  useEffect(() => {
    if (hasBoarded) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event("resize"));

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event("resize"));

        // Smooth scroll to the first station (skills) automatically
        const skillsSection = document.getElementById("skills");
        if (skillsSection) {
          skillsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [hasBoarded]);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <main className="flex-1 flex flex-col relative">
      {/* 1. Hero Station & Sunrise */}
      <HeroStation />

      {/* 2. Boarding Ticket Printer & Verification */}
      <BoardingSequence />

      {/* 3. The Journey Stations - Rendered once boarded */}
      {hasBoarded && (
        <div className="animate-fade-in">
          {/* Skills Freight Yard */}
          <div id="skills">
            <SkillsFreightYard />
          </div>

          {/* Education Express */}
          <div id="education">
            <EducationExpress />
          </div>

          {/* Project Metro */}
          <div id="projects">
            <ProjectMetro />
          </div>

          {/* Hackathon Hub */}
          <div id="hackathons">
            <HackathonHub />
          </div>

          {/* Experience Junction */}
          <div id="experience">
            <ExperienceJunction />
          </div>

          {/* Achievement Station */}
          <div id="achievements">
            <AchievementStation />
          </div>

          {/* Languages Depot */}
          <div id="languages">
            <LanguagesDepot />
          </div>

          {/* Contact Terminal */}
          <div id="contact">
            <ContactTerminal />
          </div>
        </div>
      )}
    </main>
  );
}
