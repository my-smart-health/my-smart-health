'use client'

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { Schedule } from "@/utils/types";
import Divider from "@/components/divider/Divider";

const enWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

function timeLeftCalc(
  schedules: Schedule[],
  now: Date,
  open24hLabel: string,
  closesInHoursMinutes: (hours: number, minutes: number) => string,
  closesInMinutes: (minutes: number) => string,
) {
  const currentDay = now.getDay();
  const todayEn = enWeek[currentDay];

  for (const schedule of schedules) {
    if (!schedule.day || !schedule.day[todayEn as keyof typeof schedule.day]) continue;
    if (!schedule.open || !schedule.close) continue;

    if (schedule.open === "00:00" && schedule.close === "00:00") {
      return open24hLabel;
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
        return closesInHoursMinutes(hoursLeft, minsLeft);
      } else {
        return closesInMinutes(minsLeft);
      }
    }
  }

  return null;
}

export default function ScheduleSection({ schedule, displayIsOpen = true }: { schedule: Schedule[]; displayIsOpen?: boolean }) {
  const t = useTranslations("ProfileFull");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const daysLabel = {
    Monday: t("schedule.days.monday"),
    Tuesday: t("schedule.days.tuesday"),
    Wednesday: t("schedule.days.wednesday"),
    Thursday: t("schedule.days.thursday"),
    Friday: t("schedule.days.friday"),
    Saturday: t("schedule.days.saturday"),
    Sunday: t("schedule.days.sunday"),
  } as const;

  const formatRange = (open: string, close: string) => {
    if (open === "00:00" && close === "00:00") return t("schedule.open24h");
    const start = open || "";
    const end = close || "";
    return `${start} - ${end}`;
  };

  useEffect(() => {
    setCurrentTime(new Date());
    setIsMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  if (!schedule || schedule.length === 0) return null;

  const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const now = currentTime || new Date(0);
  const currentDayIndex = isMounted ? now.getDay() : 0;
  const currentDayEn = enWeek[currentDayIndex];

  const anyBlockOpen = isMounted ? schedule.some(sch => {
    const is247 = sch.open === "00:00" && sch.close === "00:00";
    return is247 || isScheduleOpen(sch, now);
  }) : false;

  const timeLeft = isMounted && anyBlockOpen
    ? timeLeftCalc(
      schedule,
      now,
      t("schedule.open24h"),
      (hours, minutes) => t("schedule.closesInHoursMinutes", { hours, minutes }),
      (minutes) => t("schedule.closesInMinutes", { minutes }),
    )
    : null;

  return (
    <>
      <div className="p-3">
        <h2 className="font-bold text-primary text-lg mb-3">
          {t("schedule.title")}
          {displayIsOpen && (
            <>
              {" · "}
              <span className={anyBlockOpen ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
                {anyBlockOpen ? t("schedule.open") : t("schedule.closed")}
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
                  <span className="font-medium text-sm">{`${daysLabel.Monday} - ${daysLabel.Sunday}`}</span>
                  <span className="text-green-600 font-semibold text-sm">{t("schedule.open24h")}</span>
                </div>
              );
            } else {
              renderDays = activeDays.length === 0
                ? <p className="text-gray-400 text-sm py-1.5">{t("schedule.noHoursSpecified")}</p>
                : activeDays.map(dayEn => {
                  const dayLabel = daysLabel[dayEn as keyof typeof daysLabel] || dayEn;
                  const isToday = dayEn === currentDayEn;
                  let rightContent: React.ReactNode = <span className="text-gray-400 text-sm">{t("schedule.closed")}</span>;

                  if (!schBlock.open || !schBlock.close) {
                    rightContent = <span className="text-gray-400 text-sm">{t("schedule.closed")}</span>;
                  } else if (schBlock.open === "00:00" && schBlock.close === "00:00") {
                    rightContent = <span className="text-green-600 font-semibold text-sm">{t("schedule.open24h")}</span>;
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