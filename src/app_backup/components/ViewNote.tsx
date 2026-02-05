import { Note } from '../types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ViewNoteProps {
  note: Note;
  onBack: () => void;
  isEditable?: boolean;
  onUpdate?: (updatedNote: Note) => void;
}

function LinesSVG() {
  return (
    <div className="h-[244.476px] relative shrink-0 w-full">
      <div className="absolute inset-[-0.41%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 309.001 245.476">
          <g id="Frame 112">
            <line id="Line 5" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00106109" x2="309" y1="0.499999" y2="1.13947" />
            <line id="Line 7" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00106109" x2="309" y1="41.1395" y2="41.7789" />
            <line id="Line 8" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00106109" x2="309" y1="81.7789" y2="82.4184" />
            <line id="Line 9" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00106109" x2="309" y1="122.418" y2="123.058" />
            <line id="Line 10" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00106109" x2="309" y1="163.058" y2="163.697" />
            <line id="Line 11" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00106109" x2="309" y1="203.697" y2="204.337" />
            <line id="Line 12" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00106109" x2="309" y1="244.337" y2="244.976" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function ViewNote({ note, onBack, isEditable = false, onUpdate }: ViewNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string | null>(note.image);
  const [description, setDescription] = useState(note.description);
  const [isExpanded, setIsExpanded] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 500);
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...note,
        image,
        description,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setImage(note.image);
    setDescription(note.description);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#f2ede7] relative size-full overflow-hidden">
      <button
        onClick={onBack}
        className="absolute top-[24px] left-[24px] z-30 px-3 py-2 rounded-lg font-['DM_Mono:Regular',sans-serif] text-[12px] text-[#5a4a35] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
      >
        ← Back
      </button>

      <p className="-translate-x-1/2 absolute font-['DM_Mono:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[#5a4a35] text-[14px] text-center top-[72px] z-20">
        LifeNote · Day {note.day}
      </p>

      {/* Photo frame background shadow */}
      <motion.div 
        className="absolute flex h-[357.848px] items-center justify-center w-[329.774px] z-0" 
        style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0", left: '32.61px', top: '181.08px' } as React.CSSProperties}
        animate={wiggle ? {
          scale: [1, 0.95, 1.02, 0.98, 1],
          rotate: [-1.8, -3.5, -0.5, -2.5, -1.8],
        } : {
          rotate: -1.8,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <div className="flex-none">
          <div className="bg-[#e6dfd6] h-[348px] rounded-[32px] w-[319px] shadow-sm" />
        </div>
      </motion.div>

      {/* Photo frame */}
      <motion.div 
        className="absolute flex h-[374.162px] items-center justify-center w-[347.765px] z-10" 
        style={{ "--transform-inner-width": "1200", "--transform-inner-height": "753.5", left: '23.62px', top: '172.92px' } as React.CSSProperties}
        animate={wiggle ? {
          scale: [1, 0.95, 1.02, 0.98, 1],
          rotate: [4.94, 3, 6, 4, 4.94],
        } : {
          rotate: 4.94,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <div className="flex-none rotate-[4.94deg]">
          {isEditing ? (
            <div 
              onClick={handlePhotoClick}
              className="bg-white border-8 border-[#f8f7f4] border-solid h-[348px] overflow-clip relative rounded-[32px] shadow-[-2px_-2px_20px_0px_rgba(0,0,0,0.12)] w-[319px] cursor-not-allowed flex items-center justify-center"
            >
              {image && (
                <img alt="Memory" className="absolute inset-0 object-cover size-full" src={image} />
              )}
            </div>
          ) : (
            <motion.div className="bg-white border-8 border-[#f8f7f4] border-solid h-[348px] overflow-clip relative rounded-[32px] shadow-[-2px_-2px_20px_0px_rgba(0,0,0,0.12)] w-[319px]" whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
              {image && (
                <img alt="Memory" className="absolute inset-0 object-cover size-full" src={image} />
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Note display card */}
      <motion.div 
        className="-translate-x-1/2 absolute flex h-[401.879px] items-center justify-center left-[calc(50%+0.39px)] w-[369.829px] z-10 cursor-grab active:cursor-grabbing" 
        style={{ 
          "--transform-inner-width": "1200", 
          "--transform-inner-height": "210.5",
        } as React.CSSProperties}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.05}
        onDragEnd={(event, info) => {
          // If dragged down more than 150px, collapse. If dragged up, expand.
          if (info.offset.y > 150) {
            setIsExpanded(false);
          } else if (info.offset.y < -50) {
            setIsExpanded(true);
          }
        }}
        onClick={() => {
          if (!isEditing) {
            setIsExpanded(!isExpanded);
          }
        }}
        animate={isExpanded ? {
          bottom: 50,
          y: 0,
          opacity: 1,
        } : {
          bottom: [-200, -190, -200],
          y: 0,
          opacity: 1,
        }}
        transition={isExpanded ? {
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        } : {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="flex-none rotate-[-0.12deg]">
          <div className="backdrop-blur-[16px] bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col gap-[58px] items-start overflow-clip px-[30px] py-[40px] relative rounded-[32px] w-[369px]">
            <div className="flex h-[18.639px] items-center justify-center min-w-full relative shrink-0 w-[min-content]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
              <div className="flex-none rotate-[0.12deg] w-full">
                <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative text-[#2f1f0a] text-[14px] w-full whitespace-pre-wrap">
                  Your note :)
                </p>
              </div>
            </div>
            
            <LinesSVG />

            <div className="absolute flex h-[280.639px] items-start justify-start left-[29.66px] top-[85.85px] w-[309.579px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "38" } as React.CSSProperties}>
              <div className="flex-none rotate-[0.12deg]">
                {isEditing ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What happened today?"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(true);
                    }}
                    className="font-['Handlee',cursive] leading-[2.84] not-italic relative text-[14px] text-[#5a4a35] w-[309px] h-[280px] bg-transparent border-none outline-none resize-none placeholder:text-[#5a4a35] placeholder:opacity-30"
                  />
                ) : (
                  <p className="font-['Handlee',cursive] leading-[2.84] not-italic relative text-[14px] text-[#5a4a35] w-[309px] whitespace-pre-wrap">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons - show when editable */}
            {isEditable && (
              <div className="flex gap-3 justify-end w-full mt-4" onClick={(e) => e.stopPropagation()}>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-lg font-['DM_Mono:Regular',sans-serif] text-[12px] text-[#5a4a35] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-lg font-['DM_Mono:Regular',sans-serif] text-[12px] bg-[#5a4a35] text-white hover:bg-[#2f1f0a] transition-colors"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-lg font-['DM_Mono:Regular',sans-serif] text-[12px] bg-[#5a4a35] text-white hover:bg-[#2f1f0a] transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}