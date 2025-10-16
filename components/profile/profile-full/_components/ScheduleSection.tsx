'use client'

import { useState, useEffect, useMemo } from "react";
import { Schedule } from "@/utils/types";
import Divider from "@/components/divider/Divider";

// const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const daysDe = { Monday: "Montag", Tuesday: "Dienstag", Wednesday: "Mittwoch", Thursday: "Donnerstag", Friday: "Freitag", Saturday: "Samstag", Sunday: "Sonntag", SundayIso: "Sonntag" } as const;

const enWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatTimeForLocale(hhmm: string, locale: string) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  try {
    return d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.warn("Locale time formatting failed, falling back to HH:MM format.", e);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }
}

function formatRange(open: string, close: string, locale: string) {
  if (open === "00:00" && close === "00:00") return "24 Stunden geöffnet";
  const start = formatTimeForLocale(open, locale);
  const end = formatTimeForLocale(close, locale);
  const addUhr = locale && locale.startsWith && locale.startsWith("de");
  return addUhr ? `${start} - ${end} Uhr` : `${start} - ${end}`;
}

function findScheduleForDay(scheduleArr: Schedule[], dayEn: string) {
  return scheduleArr.find(sch => Boolean(sch.day && sch.day[dayEn as keyof typeof sch.day]));
}

function isScheduleOpen(schedule: Schedule, now: Date) {
  const currentDay = now.getDay(); // 0 (Sunday) - 6 (Saturday)
  const todayEn = enWeek[currentDay];
  if (!schedule.day || !schedule.day[todayEn as keyof typeof schedule.day]) return false;
  if (!schedule.open || !schedule.close) return false;
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
  const locale = typeof navigator !== "undefined" ? navigator.language || "de-DE" : "de-DE";

  const todayIndex = currentTime.getDay(); // 0 (Sunday) - 6 (Saturday)
  const orderedDays = enWeek.slice(todayIndex).concat(enWeek.slice(0, todayIndex));

  return (
    <>
      <Divider addClass="my-4" />
      <section className="flex flex-col mx-auto border-2 border-primary rounded p-2 sm:p-4 space-y-2 max-w-md">
        {orderedDays.map(dayEn => {
          const sch = findScheduleForDay(schedule, dayEn);
          const dayLabel = dayEn === "Sunday" ? daysDe["SundayIso"] : (daysDe[dayEn as keyof typeof daysDe] || dayEn);
          let rightContent: React.ReactNode = <span className="text-gray-400">geschlossen</span>;

          if (sch) {
            if (!sch.open || !sch.close) {
              rightContent = <span className="text-gray-400">Keine Öffnungszeiten angegeben</span>;
            } else if (sch.open === "00:00" && sch.close === "00:00") {
              rightContent = <span className="text-green-500/95">24 Stunden geöffnet</span>;
            } else {
              rightContent = <span className="my-auto">{formatRange(sch.open, sch.close, locale)}</span>;
            }
          }

          return (
            <div key={dayEn} className="flex flex-col md:flex-row justify-between items-center gap-1 md:gap-4 py-1">
              <div className="flex-1">
                <span className="font-medium">{dayLabel}</span>
              </div>
              <div className="my-auto text-right whitespace-nowrap">{rightContent}</div>
            </div>
          );
        })}

        {isOpenShown && displayIsOpen && (
          <span className={is247 || isOpenNow ? "font-bold text-green-500/95" : "font-bold text-red-500/95"}>
            {(is247 || isOpenNow) ? "geöffnet" : "geschlossen"}
          </span>
        )}
      </section>
    </>
  );
}