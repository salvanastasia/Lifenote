import { Note } from '../types';
import imgFrame109 from "figma:asset/72528c47bdf75b6993b41332192242fe1a52e16b.png";

interface CalendarViewProps {
  notes: Note[];
  currentDay: number;
  onDayClick: (day: number) => void;
}

function DayThumbnail({ note, onClick }: { note?: Note; onClick: () => void }) {
  if (note?.image) {
    return (
      <button
        onClick={onClick}
        className="h-[35px] pointer-events-auto relative rounded-[10px] shrink-0 w-[32px] transition-transform hover:scale-110"
      >
        {/* Rotated shadow rectangle behind */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div 
            className="bg-[#e6dfd6] h-[35px] rounded-[10px] w-[32px] absolute shadow-sm"
            style={{ transform: 'rotate(-2deg)' }}
          />
        </div>
        
        {/* Main photo frame */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 rounded-[10px] z-10"
          style={{ transform: 'rotate(3deg)' }}
        >
          <div className="absolute bg-white inset-0 rounded-[10px]" />
          <img alt="" className="absolute max-w-none object-cover rounded-[10px] size-full" src={note.image} />
          <div aria-hidden="true" className="absolute border-2 border-[#f8f7f4] border-solid inset-0 rounded-[10px]" />
        </div>
      </button>
    );
  }

  // Empty day - show dot
  return (
    <button
      onClick={onClick}
      className="h-[35px] rounded-[10px] shrink-0 w-[32px] flex items-center justify-center transition-transform hover:scale-110"
    >
      <div className="w-2 h-2 rounded-full bg-[#a4947f] opacity-30" />
    </button>
  );
}

export default function CalendarView({ notes, currentDay, onDayClick }: CalendarViewProps) {
  // Calculate total days in current year
  const currentYear = new Date().getFullYear();
  const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
  const totalDays = isLeapYear ? 366 : 365;
  
  const cols = 7;
  const rows = Math.ceil(totalDays / cols); // Calculate rows needed to fit all days

  const getNoteForDay = (day: number) => {
    return notes.find(note => note.day === day);
  };

  return (
    <div className="bg-[#f2ede7] relative size-full overflow-y-auto">
      <p className="-translate-x-1/2 absolute font-['DM_Mono:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[#5a4a35] text-[14px] text-center top-[72px] z-10">
        LifeNote · Day {currentDay}
      </p>
      
      <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-start justify-start left-[calc(50%+0.5px)] top-[142px] gap-4 pb-8">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
            {Array.from({ length: cols }).map((_, colIndex) => {
              const dayNumber = rowIndex * cols + colIndex + 1;
              // Only render if within the year's day count
              if (dayNumber > totalDays) return null;
              
              const note = getNoteForDay(dayNumber);
              const isToday = dayNumber === currentDay;
              
              return (
                <div key={dayNumber} className="relative">
                  <DayThumbnail
                    note={note}
                    onClick={() => onDayClick(dayNumber)}
                  />
                  {isToday && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#5a4a35] rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10" style={{
        background: 'linear-gradient(to bottom, transparent, #f2ede7)'
      }} />
    </div>
  );
}