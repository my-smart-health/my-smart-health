'use client'

import { useState, useEffect, useMemo } from "react";
import { Schedule } from "@/utils/types";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const daysDe = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

function getActiveDays(schedule: Schedule) {
  return days
    .filter(day => schedule.day[day as keyof typeof schedule.day])
    .map(day => daysDe[days.indexOf(day)]);
}

function getFirstLastDay(schedule: Schedule) {
  const activeDays = getActiveDays(schedule);
  if (activeDays.length === 1) return <span>{activeDays[0]}</span>;
  return <span>{activeDays[0]} - {activeDays[activeDays.length - 1]}</span>;
}

function isScheduleOpen(schedule: Schedule, now: Date) {
  const currentDay = now.getDay(); // 0 (Sunday) - 6 (Saturday)
  const daysOfWeek = ["Sunday", ...days.slice(0, 6)];
  const todayEn = daysOfWeek[currentDay];
  const activeDays = days
    .filter(day => schedule.day[day as keyof typeof schedule.day]);
  if (!activeDays.includes(todayEn)) return false;

  const [openH, openM] = schedule.open.split(":").map(Number);
  const [closeH, closeM] = schedule.close.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
}

export default function ScheduleSection({ schedule, displayIsOpen = true }: { schedule: Schedule[]; displayIsOpen?: boolean }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const isOpenShown = useMemo(
    () => schedule.some(sch => sch.open && sch.close),
    [schedule]
  );

  const isOpenNow = useMemo(
    () => schedule.some(sch => isScheduleOpen(sch, currentTime)),
    [schedule, currentTime]
  );

  if (!schedule || schedule.length === 0) return null;

  const is247 = schedule.some(sch => sch.open === "00:00" && sch.close === "00:00");

  return (
    <>
      <section className="flex flex-col space-y-2">
        {schedule.length > 0 ? (
          schedule.map(sch => {
            const activeDays = getActiveDays(sch);
            if (activeDays.length === 0) {
              return <p key={sch.id} className="text-gray-400">Keine Öffnungszeiten angegeben</p>;
            }
            if (!sch.open || !sch.close) {
              return (
                <div key={sch.id} className="grid grid-cols-2 justify-evenly gap-6 py-1">
                  <div>{getFirstLastDay(sch)}</div>
                  <div><span className="text-gray-400">Keine Öffnungszeiten angegeben</span></div>
                </div>
              );
            }
            if (sch.open === "00:00" && sch.close === "00:00") {
              return (
                <div key={sch.id} className="grid grid-cols-2 justify-evenly gap-6 py-1">
                  <div>{getFirstLastDay(sch)}</div>
                  <div>
                    <span className="text-green-500/95">24 Stunden geöffnet</span>
                  </div>
                </div>
              );
            }
            return (
              <div key={sch.id} className="grid grid-cols-2 justify-evenly gap-6 py-1">
                <div>{getFirstLastDay(sch)}</div>
                <div>
                  {sch.open && sch.close && (
                    <>
                      <span>{sch.open}</span>
                      <span> - </span>
                      <span>{sch.close}</span>
                      <span> Uhr</span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400">Keine Öffnungszeiten angegeben</p>
        )}
        {isOpenShown && displayIsOpen && (
          <span className={is247 || isOpenNow ? "font-bold text-green-500/95" : "font-bold text-red-500/95"}>
            {(is247 || isOpenNow) ? "geöffnet" : "geschlossen"}
          </span>
        )}
      </section>
    </>
  );
}