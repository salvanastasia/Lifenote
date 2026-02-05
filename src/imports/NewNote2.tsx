import imgImage1 from "figma:asset/72528c47bdf75b6993b41332192242fe1a52e16b.png";

function Frame() {
  return <div className="bg-[#e6dfd6] h-[348px] rounded-[32px] w-[319px]" />;
}

function Frame1() {
  return (
    <div className="bg-white border-8 border-[#f8f7f4] border-solid h-[348px] overflow-clip relative rounded-[32px] shadow-[-2px_-2px_20px_0px_rgba(0,0,0,0.12)] w-[319px]">
      <div className="absolute flex h-[817.025px] items-center justify-center left-[-422.22px] top-[-242.51px] w-[1147.439px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "753.5" } as React.CSSProperties}>
        <div className="flex-none rotate-[-4.94deg]">
          <div className="h-[726px] relative w-[1089px]" data-name="image 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
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

function Frame2() {
  return (
    <div className="backdrop-blur-[16px] bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col gap-[58px] items-start overflow-clip px-[30px] py-[40px] relative rounded-[32px] w-[369px]">
      <div className="flex h-[18.639px] items-center justify-center min-w-full relative shrink-0 w-[min-content]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.12deg] w-full">
          <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative text-[#2f1f0a] text-[14px] w-full whitespace-pre-wrap">Add a note to your memory</p>
        </div>
      </div>
      <Frame3 />
      <div className="absolute flex h-[280.639px] items-center justify-center left-[29.66px] top-[85.85px] w-[309.579px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "38" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.12deg]">
          <p className="font-['Figma_Hand:Regular',sans-serif] leading-[2.84] not-italic relative text-[#5a4a35] text-[14px] w-[309px] whitespace-pre-wrap">Woke up to the smell of lemons and the sound of the Tyrrhenian Sea. Explored the colorful streets of Positano, each corner a postcard. Ended the day with fresh pasta overlooking the coast. Sicily is pure magic.</p>
        </div>
      </div>
    </div>
  );
}

export default function NewNote() {
  return (
    <div className="bg-[#f2ede7] relative size-full" data-name="New Note 2">
      <p className="-translate-x-1/2 absolute font-['DM_Mono:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[#5a4a35] text-[14px] text-center top-[72px]">LifeNote · Day 55</p>
      <div className="absolute flex h-[368.376px] items-center justify-center left-[26.82px] top-[175.81px] w-[341.362px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-3.8deg]">
          <Frame />
        </div>
      </div>
      <div className="absolute flex h-[380.416px] items-center justify-center left-[20.14px] top-[169.79px] w-[354.718px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "753.5" } as React.CSSProperties}>
        <div className="flex-none rotate-[6.2deg]">
          <Frame1 />
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[50.92px] flex h-[401.879px] items-center justify-center left-[calc(50%+0.39px)] w-[369.829px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "210.5" } as React.CSSProperties}>
        <div className="flex-none rotate-[-0.12deg]">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}