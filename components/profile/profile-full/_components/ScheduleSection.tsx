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

  if (!schedule || schedule.length === 0) return null;

  const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
      <Divider addClass="my-4" />
      <div className="space-y-4">
        {schedule.map((schBlock, idx) => {
          const blockIs247 = schBlock.open === "00:00" && schBlock.close === "00:00";
          const blockIsOpenNow = isScheduleOpen(schBlock, currentTime);

          return (
            <section key={schBlock.id || idx} className="flex flex-col mx-auto border-2 border-primary rounded p-2 sm:p-4 space-y-2 max-w-md">

              {schBlock.title && <h3 className="font-bold text-primary text-lg">{schBlock.title}</h3>}

              {schBlock.title && <Divider addClass="my-4" />}

              {(() => {
                const activeDays = orderedDays.filter(dayEn => Boolean(schBlock.day && schBlock.day[dayEn as keyof typeof schBlock.day]));
                if (activeDays.length === 0) {
                  return <p className="text-gray-400 break-words whitespace-normal">Keine Öffnungszeiten angegeben</p>;
                }

                return activeDays.map(dayEn => {
                  const dayLabel = dayEn === "Sunday" ? daysDe["SundayIso"] : (daysDe[dayEn as keyof typeof daysDe] || dayEn);
                  let rightContent: React.ReactNode = <span className="text-gray-400">Keine Öffnungszeiten angegeben</span>;

                  if (!schBlock.open || !schBlock.close) {
                    rightContent = <span className="text-gray-400">Keine Öffnungszeiten angegeben</span>;
                  } else if (schBlock.open === "00:00" && schBlock.close === "00:00") {
                    rightContent = <span className="text-green-500/95">24 Stunden geöffnet</span>;
                  } else {
                    rightContent = <span className="my-auto">{formatRange(schBlock.open, schBlock.close)}</span>;
                  }

                  return (
                    <div key={dayEn} className="flex flex-row justify-between items-center gap-1 py-1">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium truncate">{dayLabel}</span>
                      </div>
                      <div className="my-auto text-right whitespace-nowrap">{rightContent}</div>
                    </div>
                  );
                });
              })()}

              {displayIsOpen && ((schBlock.open && schBlock.close) || blockIs247) && (
                <span className={blockIs247 || blockIsOpenNow ? "font-bold text-green-500/95" : "font-bold text-red-500/95"}>
                  {(blockIs247 || blockIsOpenNow) ? "geöffnet" : "geschlossen"}
                </span>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}