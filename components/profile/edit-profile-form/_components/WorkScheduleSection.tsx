import Divider from "@/components/divider/Divider";
import { ArrowUpRight } from "lucide-react";
import { Schedule } from "@/utils/types";

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
  return (
    <section>
      {schedule.map((item, idx) => (
        <fieldset
          key={item.id}
          className="fieldset grid-cols-2 max-w-[99.9%]"
        >
          <legend className="fieldset-legend">Work Schedule</legend>
          <div className="grid grid-cols-1 w-full max-w-[99.9%] gap-2">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <label key={day} htmlFor={`schedule-${day.toLowerCase()}`} className="label">
                <input
                  type="checkbox"
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
          <div className="grid grid-rows-2 gap-3 justify-baseline mt-4 w-full max-w-[99.9%]">
            <label htmlFor="time" className="label text-center flex-col">
              <span className="label-text">Time start</span>
              <div className="flex flex-col">
                <input
                  type="time"
                  id="time"
                  name="time-start"
                  value={item.open}
                  className="p-2 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  onChange={(e) => setScheduleTime(item.id, 'open', e.target.value)}
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
                  id="time-end"
                  name="time-end"
                  value={item.close}
                  style={{ textTransform: 'none' }}
                  className="p-2 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  onChange={(e) => setScheduleTime(item.id, 'close', e.target.value)}
                />
                <span className="text-xs text-gray-500 w-fit flex flex-nowrap">
                  click here to set <ArrowUpRight />
                </span>
              </div>
            </label>
            <span>select Open and Close to 12:00 AM <br /> for 24/7 schedule</span>
            <button
              type="button"
              onClick={() => setSchedule(schedule.filter((_, i) => i !== idx))}
              className="btn btn-outline w-full text-red-500 self-end"
            >
              Remove
            </button>
          </div>
          <Divider addClass="my-4 col-span-2" />
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() =>
          setSchedule([
            ...schedule,
            {
              id: crypto.randomUUID(),
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
        Add Schedule
      </button>
    </section>
  );
}