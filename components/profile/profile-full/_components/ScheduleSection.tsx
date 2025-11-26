'use client'

import { useState, useEffect } from "react";

import { Schedule } from "@/utils/types";
import Divider from "@/components/divider/Divider";

const daysDe = { Monday: "Montag", Tuesday: "Dienstag", Wednesday: "Mittwoch", Thursday: "Donnerstag", Friday: "Freitag", Saturday: "Samstag", Sunday: "Sonntag", SundayIso: "Sonntag" } as const;

const enWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatRange(open: string, close: string) {
  if (open === "00:00" && close === "00:00") return "24 Stunden geöffnet";
  const start = open || "";
  const end = close || "";
  return `${start} - ${end}`;
}

function isScheduleOpen(schedule: Schedule, now: Date) {
  const currentDay = now.getDay(); // 0 (Sunday) - 6 (Saturday)
  const todayEn = enWeek[currentDay];
  if (!schedule.day || !schedule.day[todayEn as keyof typeof schedule.day]) return false;
  if (!schedule.open || !schedule.close) return false;

  if (schedule.open === "00:00" && schedule.close === "00:00") return true;

  const [openH, openM] = schedule.open.split(":").map(Number);
  const [closeH, closeM] = schedule.close.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;

  if (closeH === 0 && closeM === 0) {
    closeMinutes = 24 * 60;
  }

  return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
}

function timeLeftCalc(schedules: Schedule[], now: Date) {
  const currentDay = now.getDay();
  const todayEn = enWeek[currentDay];

  for (const schedule of schedules) {
    if (!schedule.day || !schedule.day[todayEn as keyof typeof schedule.day]) continue;
    if (!schedule.open || !schedule.close) continue;

    if (schedule.open === "00:00" && schedule.close === "00:00") {
      return "24 Stunden geöffnet";
    }

    const [openH, openM] = schedule.open.split(":").map(Number);
    const [closeH, closeM] = schedule.close.split(":").map(Number);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openH * 60 + openM;
    let closeMinutes = closeH * 60 + closeM;

    if (closeH === 0 && closeM === 0) {
      closeMinutes = 24 * 60;
    }

    if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
      const minutesLeft = closeMinutes - nowMinutes;
      const hoursLeft = Math.floor(minutesLeft / 60);
      const minsLeft = minutesLeft % 60;

      if (hoursLeft > 0) {
        return `schließt in ${hoursLeft}h ${minsLeft}min`;
      } else {
        return `schließt in ${minsLeft}min`;
      }
    }
  }

  return null;
}

export default function ScheduleSection({ schedule, displayIsOpen = true }: { schedule: Schedule[]; displayIsOpen?: boolean }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  if (!schedule || schedule.length === 0) return null;

  const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const currentDayIndex = currentTime.getDay();
  const currentDayEn = enWeek[currentDayIndex];

  const anyBlockOpen = schedule.some(sch => {
    const is247 = sch.open === "00:00" && sch.close === "00:00";
    return is247 || isScheduleOpen(sch, currentTime);
  });

  const timeLeft = isMounted && anyBlockOpen ? timeLeftCalc(schedule, currentTime) : null;

  return (
    <>
      <Divider addClass="my-1" />
      <div className="p-3">
        <h2 className="font-bold text-primary text-lg mb-3">
          Öffnungszeiten
          {displayIsOpen && (
            <>
              {" · "}
              <span className={anyBlockOpen ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
                {anyBlockOpen ? "Geöffnet" : "Geschlossen"}
              </span>
              {anyBlockOpen && timeLeft && (
                <span className="text-gray-500 text-sm font-normal"> · {timeLeft}</span>
              )}
            </>
          )}
        </h2>

        <div className="space-y-3">
          {schedule.map((schBlock, idx) => {
            const blockIs247 = schBlock.open === "00:00" && schBlock.close === "00:00";

            const activeDays = orderedDays.filter(dayEn => Boolean(schBlock.day && schBlock.day[dayEn as keyof typeof schBlock.day]));

            let renderDays: React.ReactNode;
            if (blockIs247) {
              renderDays = (
                <div className="flex justify-between items-center py-1.5 px-2 rounded bg-green-50">
                  <span className="font-medium text-sm">{`${daysDe.Monday} - ${daysDe.SundayIso}`}</span>
                  <span className="text-green-600 font-semibold text-sm">24h geöffnet</span>
                </div>
              );
            } else {
              renderDays = activeDays.length === 0
                ? <p className="text-gray-400 text-sm py-1.5">Keine Öffnungszeiten angegeben</p>
                : activeDays.map(dayEn => {
                  const dayLabel = dayEn === "Sunday" ? daysDe["SundayIso"] : (daysDe[dayEn as keyof typeof daysDe] || dayEn);
                  const isToday = dayEn === currentDayEn;
                  let rightContent: React.ReactNode = <span className="text-gray-400 text-sm">Geschlossen</span>;

                  if (!schBlock.open || !schBlock.close) {
                    rightContent = <span className="text-gray-400 text-sm">Geschlossen</span>;
                  } else if (schBlock.open === "00:00" && schBlock.close === "00:00") {
                    rightContent = <span className="text-green-600 font-semibold text-sm">24h geöffnet</span>;
                  } else {
                    rightContent = <span className="text-sm">{formatRange(schBlock.open, schBlock.close)}</span>;
                  }

                  return (
                    <div
                      key={dayEn}
                      className={`flex justify-between items-center py-1.5 px-2 rounded transition-colors ${isToday
                        ? 'border-2 border-primary bg-primary/5 font-semibold'
                        : 'hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-sm">{dayLabel}</span>
                      <span className="text-right">{rightContent}</span>
                    </div>
                  );
                });
            }
            return (
              <div key={schBlock.id || idx} className="border border-gray-400 rounded-lg p-3 bg-white">
                {schBlock.title && (
                  <>
                    <h3 className="font-semibold text-primary text-base mb-2">{schBlock.title}</h3>
                    <Divider addClass="my-2" />
                  </>
                )}
                <div className="space-y-0.5">{renderDays}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}