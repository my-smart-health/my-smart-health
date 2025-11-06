import Divider from "@/components/divider/Divider";
import { ArrowUp, ArrowUpRight, CalendarCheck } from "lucide-react";
import { Schedule } from "@/utils/types";
import { ScheduleSection } from "../../profile-full/_components";
import { useState } from "react";

type WorkScheduleSectionProps = {
  schedule: Schedule[];
  setSchedule: (schedule: Schedule[]) => void;
  toggleScheduleDay: (id: string, day: keyof Schedule['day']) => void;
  setScheduleTime: (id: string, openClose: keyof Schedule, value: string) => void;
};

const dayTranslations: Record<string, string> = {
  Monday: "Montag",
  Tuesday: "Dienstag",
  Wednesday: "Mittwoch",
  Thursday: "Donnerstag",
  Friday: "Freitag",
  Saturday: "Samstag",
  Sunday: "Sonntag",
};

export function WorkScheduleSection({
  schedule,
  setSchedule,
  toggleScheduleDay,
  setScheduleTime,
}: WorkScheduleSectionProps) {
  const [nonStopState, setNonStopState] = useState<{ [id: string]: boolean }>({});
  const [prevValues, setPrevValues] = useState<{ [id: string]: Schedule | null }>({});

  function handleNonStopToggle(id: string, checked: boolean, item: Schedule) {
    if (checked) {
      setPrevValues(prev => ({ ...prev, [id]: { ...item } }));
      setNonStopState(prev => ({ ...prev, [id]: true }));
      setSchedule(
        schedule.map(sch =>
          sch.id === id
            ? {
              ...sch,
              day: {
                Monday: true,
                Tuesday: true,
                Wednesday: true,
                Thursday: true,
                Friday: true,
                Saturday: true,
                Sunday: true,
              },
              open: "00:00",
              close: "00:00",
            }
            : sch
        )
      );
    } else {
      setNonStopState(prev => ({ ...prev, [id]: false }));
      setSchedule(
        schedule.map(sch =>
          sch.id === id
            ? prevValues[id]
              ? { ...sch, ...prevValues[id] }
              : {
                ...sch,
                day: {
                  Monday: false,
                  Tuesday: false,
                  Wednesday: false,
                  Thursday: false,
                  Friday: false,
                  Saturday: false,
                  Sunday: false,
                },
                open: "",
                close: "",
              }
            : sch
        )
      );
    }
  }

  function isNonStop(item: Schedule) {
    return (
      item.open === "00:00" &&
      item.close === "00:00" &&
      Object.values(item.day).every(Boolean)
    );
  }

  return (
    <section>
      {schedule.map((item, idx) => (
        <div key={item.id} className="mb-3">
          <fieldset
            key={item.id}
            className="fieldset grid-cols-2 max-w-[99.9%]"
          >
            <legend className="fieldset-legend">Work Schedule</legend>

            <div
              className="mx-auto  rounded p-4 col-span-2 w-full max-w-[99.9%] flex flex-col justify-center"
              style={{ minHeight: '120px', height: 'auto', boxSizing: 'border-box' }}
            >
              <label htmlFor="location" className="label">Schedule Preview</label>
              <div style={{ minHeight: '48px' }}>
                <ScheduleSection schedule={[item]} />
              </div>
            </div>

            <Divider addClass="my-4 col-span-2" />

            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                className="grid grid-cols-1 mx-auto w-fit max-w-[99.9%] gap-2"
                style={{ opacity: isNonStop(item) ? 0.5 : 1, pointerEvents: isNonStop(item) ? 'none' : 'auto' }}>
                <div className="mb-2">
                  <label className="label flex flex-col">
                    <span className="label-text">Title (optional)</span>
                    <input
                      type="text"
                      value={item.title ?? ''}
                      onChange={(e) => setSchedule(schedule.map(s => s.id === item.id ? { ...s, title: e.target.value } : s))}
                      className="p-2 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      placeholder="e.g. Monday - Friday"
                    />
                  </label>
                </div>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <label key={day} htmlFor={`schedule-${day.toLowerCase()}`} className="label">
                    <input
                      type="checkbox"
                      disabled={!!nonStopState[item.id]}
                      name={`schedule-${day.toLowerCase()}`}
                      value={day}
                      className="checkbox checkbox-primary"
                      checked={item.day[day as keyof Schedule['day']]}
                      onChange={() => toggleScheduleDay(item.id, day as keyof Schedule['day'])}
                    />
                    {dayTranslations[day] || day}
                  </label>
                ))}
              </div>
              <div
                className="grid grid-rows-2 gap-3 justify-baseline mt-4 w-full max-w-[99.9%]"
                style={{ opacity: isNonStop(item) ? 0.5 : 1, pointerEvents: isNonStop(item) ? 'none' : 'auto' }}>
                <label htmlFor="time" className="label text-center flex-col">
                  <span className="label-text">Time start</span>
                  <div className="flex flex-col">
                    <input
                      type="time"
                      value={item.open}
                      className="p-2 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      onChange={(e) => setScheduleTime(item.id, 'open', e.target.value)}
                      onClick={e => e.stopPropagation()}
                      disabled={isNonStop(item)}
                    />
                    <span className="text-xs text-gray-500 w-fit flex flex-nowrap">
                      click here to set <ArrowUpRight />
                    </span>
                  </div>
                </label>
                <label htmlFor="time-end" className="label text-center flex-col">
                  <span className="label-text">Time end</span>
                  <div className="flex flex-col">
                    <input
                      type="time"
                      name="time-end"
                      value={item.close}
                      style={{ textTransform: 'none' }}
                      className="p-2 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      onChange={(e) => setScheduleTime(item.id, 'close', e.target.value)}
                      onClick={e => e.stopPropagation()}
                      disabled={isNonStop(item)}
                    />
                    <span className="text-xs text-gray-500 w-fit flex flex-nowrap">
                      click here to set <ArrowUpRight />
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </fieldset>

          <Divider addClass="my-4 col-span-2" />

          <div>
            <fieldset className="fieldset border-primary flex justify-center rounded-box w-full border p-2 md:p-4">
              <legend className="fieldset-legend">Non-stop</legend>
              <label className="label">
                <input
                  type="checkbox"
                  checked={isNonStop(item)}
                  className="toggle"
                  onChange={e => handleNonStopToggle(item.id, e.target.checked, item)}
                />
                <span className="label-text">Open 24 hours / 7 days</span>
              </label>
            </fieldset>

            <Divider addClass="my-4 col-span-2" />

            <button
              type="button"
              onClick={() => {
                if (!confirm("Are you sure you want to remove this schedule?")) return;
                setSchedule(schedule.filter((_, i) => i !== idx));
              }}
              className="btn btn-outline w-full text-red-500 self-end"
            >
              <ArrowUp /> Remove
            </button>

            <Divider addClass="my-4 col-span-2" />

          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setSchedule([
            ...schedule,
            {
              id: crypto.randomUUID(),
              title: '',
              day: {
                Monday: false,
                Tuesday: false,
                Wednesday: false,
                Thursday: false,
                Friday: false,
                Saturday: false,
                Sunday: false,
              },
              open: '',
              close: '',
            },
          ])
        }
        className="btn btn-outline btn-primary w-full mt-2 px-3 py-1 rounded"
      >
        <CalendarCheck />  Add Schedule
      </button>
    </section>
  );
}