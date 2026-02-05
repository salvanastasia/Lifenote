import { useState } from 'react';
import { Note } from '../types';
import { motion } from 'motion/react';

interface NewNoteViewProps {
  currentDay: number;
  onSave: (note: Omit<Note, 'day' | 'date'>) => void;
  onCancel: () => void;
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

export default function NewNoteView({ currentDay, onSave, onCancel }: NewNoteViewProps) {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleSave = async () => {
    if (image || description) {
      setIsSaving(true);
      
      // Wait for animation to complete before navigating
      setTimeout(() => {
        onSave({ image, description });
      }, 2000); // Total animation duration
    }
  };

  return (
    <div className="bg-[#f2ede7] relative size-full overflow-hidden">
      {/* Title */}
      <motion.p 
        className="-translate-x-1/2 absolute font-['DM_Mono:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[#5a4a35] text-[14px] text-center top-[72px] z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={isSaving ? {
          opacity: 0,
          filter: 'blur(10px)',
        } : {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        LifeNote · Day {currentDay}
      </motion.p>

      {/* Photo frame background shadow */}
      <motion.div 
        className="absolute flex h-[357.848px] items-center justify-center w-[329.774px] z-0" 
        style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}
        initial={{ opacity: 0, y: -30 }}
        animate={isSaving ? {
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          scale: 1.1,
          opacity: 1,
        } : {
          left: '32.61px',
          top: '181.08px',
          x: '0%',
          y: '0%',
          scale: 1,
          opacity: 1,
        }}
        transition={isSaving ? {
          duration: 0.8,
          delay: 0.8,
          ease: [0.34, 1.56, 0.64, 1], // Playful spring ease
        } : {
          duration: 0.6,
          delay: 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <motion.div 
          className="flex-none"
          animate={isSaving ? {
            rotate: -3.5,
          } : {
            rotate: -1.8,
          }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <div className="bg-[#e6dfd6] h-[348px] rounded-[32px] w-[319px]" />
        </motion.div>
      </motion.div>

      {/* Photo frame with upload */}
      <motion.div 
        className="absolute flex h-[374.162px] items-center justify-center w-[347.765px] z-10" 
        style={{ "--transform-inner-width": "1200", "--transform-inner-height": "753.5" } as React.CSSProperties}
        initial={{ opacity: 0, y: -30 }}
        animate={isSaving ? {
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          scale: 1.1,
          opacity: 1,
        } : {
          left: '23.62px',
          top: '172.92px',
          x: '0%',
          y: '0%',
          scale: 1,
          opacity: 1,
        }}
        transition={isSaving ? {
          duration: 0.8,
          delay: 0.8,
          ease: [0.34, 1.56, 0.64, 1],
        } : {
          duration: 0.6,
          delay: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <motion.div 
          className="flex-none"
          animate={isSaving ? {
            rotate: 7,
          } : {
            rotate: 4.94,
          }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <label className="bg-white border-8 border-[#f8f7f4] border-solid h-[348px] overflow-clip relative rounded-[32px] shadow-[-2px_-2px_20px_0px_rgba(0,0,0,0.12)] w-[319px] cursor-pointer flex items-center justify-center">
            {image ? (
              <img alt="Uploaded memory" className="absolute inset-0 object-cover size-full" src={image} />
            ) : (
              <div className="text-center p-6">
                <p className="font-['DM_Mono:Regular',sans-serif] text-[#5a4a35] text-[12px]">
                  Tap to add photo
                </p>
              </div>
            )}
            {!isSaving && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            )}
          </label>
        </motion.div>
      </motion.div>

      {/* Note input card */}
      <motion.div 
        className="-translate-x-1/2 absolute flex h-[401.879px] items-center justify-center left-[calc(50%+0.41px)] w-[369.829px] z-10 cursor-grab active:cursor-grabbing" 
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
          if (!isSaving) {
            setIsExpanded(!isExpanded);
          }
        }}
        initial={{ opacity: 0, y: 100 }}
        animate={isSaving ? {
          bottom: 50,
          y: 100,
          opacity: 0,
        } : isExpanded ? {
          bottom: 50,
          y: 0,
          opacity: 1,
        } : {
          bottom: [-200, -190, -200],
          y: 0,
          opacity: 1,
        }}
        transition={isSaving || isExpanded ? {
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        } : {
          opacity: { duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] },
          y: { duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] },
          bottom: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="flex-none rotate-[-0.12deg]">
          <div className="backdrop-blur-[16px] bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col gap-[58px] items-start overflow-clip px-[30px] py-[40px] relative rounded-[32px] w-[369px]">
            <motion.div 
              className="flex h-[18.639px] items-center justify-center min-w-full relative shrink-0 w-[min-content]" 
              style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 0.4,
                delay: 0.7,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div className="flex-none rotate-[0.12deg] w-full">
                <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative text-[#2f1f0a] text-[14px] w-full whitespace-pre-wrap">
                  Add a note to your memory
                </p>
              </div>
            </motion.div>
            
            <LinesSVG />

            <motion.div 
              className="absolute flex h-[280.639px] items-start justify-start left-[29.66px] top-[85.85px] w-[309.579px]" 
              style={{ "--transform-inner-width": "1200", "--transform-inner-height": "38" } as React.CSSProperties}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 0.4,
                delay: 0.9,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div className="flex-none rotate-[0.12deg]">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What happened today?"
                  disabled={isSaving}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  className="font-['Handlee',cursive] leading-[2.84] not-italic relative text-[14px] text-[#5a4a35] w-[309px] h-[280px] bg-transparent border-none outline-none resize-none placeholder:text-[#5a4a35] placeholder:opacity-30"
                />
              </div>
            </motion.div>

            {/* Action buttons */}
            {!isSaving && (
              <div className="flex gap-3 justify-end w-full mt-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg font-['DM_Mono:Regular',sans-serif] text-[12px] text-[#5a4a35] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!image && !description}
                  className="px-4 py-2 rounded-lg font-['DM_Mono:Regular',sans-serif] text-[12px] bg-[#5a4a35] text-white hover:bg-[#2f1f0a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}