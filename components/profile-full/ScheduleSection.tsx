'use client'

import { useState, useEffect } from "react";
import { Schedule } from "@/utils/types";

export default function ScheduleSection({ schedule }: { schedule: Schedule[] }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000 * 30); // !!! update every 30 seconds !!!
    return () => clearInterval(timer);
  }, []);

  const currentDay = currentTime.getDay();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  let isOpenNow = false;

  function getFirstLastDay(schedule: Schedule) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const daysDe = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    const allDays = days.filter(day => schedule.day[day as keyof typeof schedule.day] === true)
      .filter(day => day[0] || day[1])
      .map(day => daysDe[days.indexOf(day)]);

    return <span>{allDays[0]} - {allDays[allDays.length - 1]}</span>
    // all days
    // return <span>{allDays.join(", ")}</span>;
  }

  function getAllDays(schedule: Schedule) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const daysDe = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

    const allDays = days.filter(day => schedule.day[day as keyof typeof schedule.day] === true)
      .filter(day => day[0] || day[1])
      .map(day => daysDe[days.indexOf(day)]);

    return allDays;
  }

  return (
    <>
      <h2 className="font-bold text-primary text-xl">Öffnungszeiten</h2>

      {schedule && schedule.length > 0 ? (
        schedule.map((schedule) => {
          const allDays = getAllDays(schedule);

          const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const today = daysOfWeek[currentDay];

          const isTodayIncluded = allDays.includes(today);
          const openHour = [parseInt(schedule.open.split(":")[0]), parseInt(schedule.open.split(":")[1])];
          const closeHour = [parseInt(schedule.close.split(":")[0]), parseInt(schedule.close.split(":")[1])];

          const currentTotalMinutes = currentHour * 60 + currentMinutes;
          const openTotalMinutes = openHour[0] * 60 + openHour[1];
          const closeTotalMinutes = closeHour[0] * 60 + closeHour[1];

          if (isTodayIncluded && currentTotalMinutes >= openTotalMinutes && currentTotalMinutes <= closeTotalMinutes) {
            isOpenNow = true;
          }

          return (
            <div key={schedule.id} className="grid grid-cols-2 justify-evenly gap-6 py-2">
              <div>
                <span>
                  {getFirstLastDay(schedule)}
                </span>
              </div>
              <div>
                <span>{schedule.open}</span>
                <span> - </span>
                <span>{schedule.close}</span>
                <span> Uhr</span>
              </div>
            </div>
          )
        })
      ) : (
        <p className="text-gray-400">Keine Öffnungszeiten angegeben</p>
      )}
      {
        <span className={isOpenNow ? "font-bold text-green-500/95" : "font-bold text-red-500/95"}>
          {isOpenNow ? "geöffnet" : "geschlossen"}
        </span>
      }
    </>
  );
}