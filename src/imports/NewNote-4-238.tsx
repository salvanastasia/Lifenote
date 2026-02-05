import imgImage1 from "figma:asset/72528c47bdf75b6993b41332192242fe1a52e16b.png";

function Frame() {
  return <div className="bg-[#e6dfd6] h-[348px] rounded-[32px] w-[319px]" />;
}

function Frame1() {
  return (
    <div className="bg-white border-8 border-[#f8f7f4] border-solid h-[348px] overflow-clip relative rounded-[32px] shadow-[-2px_-2px_20px_0px_rgba(0,0,0,0.12)] w-[319px]">
      <div className="absolute flex h-[817.025px] items-center justify-center left-[-422.22px] top-[-242.51px] w-[1147.439px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[-4.94deg]">
          <div className="h-[726px] relative w-[1089px]" data-name="image 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[23px] top-[239px]">
      <div className="absolute flex h-[357.848px] items-center justify-center left-[32px] top-[247.16px] w-[329.774px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-1.8deg]">
          <Frame />
        </div>
      </div>
      <div className="absolute flex h-[374.162px] items-center justify-center left-[23px] top-[239px] w-[347.765px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[4.94deg]">
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[244.255px] relative shrink-0 w-full">
      <div className="absolute inset-[-0.41%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 293.717 245.255">
          <g id="Frame 112">
            <line id="Line 5" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00134987" x2="293.716" y1="0.499999" y2="1.10784" />
            <line id="Line 7" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00134987" x2="293.716" y1="41.1078" y2="41.7157" />
            <line id="Line 8" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00134987" x2="293.716" y1="81.7157" y2="82.3235" />
            <line id="Line 9" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00134987" x2="293.716" y1="122.324" y2="122.931" />
            <line id="Line 10" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00134987" x2="293.716" y1="162.931" y2="163.539" />
            <line id="Line 11" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00134987" x2="293.716" y1="203.539" y2="204.147" />
            <line id="Line 12" stroke="var(--stroke-0, #A4947F)" strokeOpacity="0.3" x1="0.00134987" x2="293.716" y1="244.147" y2="244.755" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="backdrop-blur-[16px] bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col gap-[58px] h-[232.744px] items-start overflow-clip px-[30px] py-[40px] relative rounded-[32px] w-[353.715px]">
      <div className="flex h-[18.608px] items-center justify-center min-w-full relative shrink-0 w-[min-content]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.12deg] w-full">
          <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative text-[#2f1f0a] text-[14px] w-full whitespace-pre-wrap">Your Note</p>
        </div>
      </div>
      <Frame3 />
      <div className="absolute flex h-[280.639px] items-center justify-center left-[29.66px] top-[85.85px] w-[309.579px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "38" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.12deg]">
          <p className="bg-clip-text bg-gradient-to-b font-['Figma_Hand:Regular',sans-serif] from-[#5a4a35] leading-[2.84] not-italic relative text-[14px] to-[63.693%] to-[rgba(90,74,53,0)] w-[309px] whitespace-pre-wrap" style={{ WebkitTextFillColor: "transparent" }}>
            Woke up to the smell of lemons and the sound of the Tyrrhenian Sea. Explored the colorful streets of Positano, each corner a postcard. Ended the day with fresh pasta overlooking the coast. Sicily is pure magic.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NewNote() {
  return (
    <div className="bg-[#f2ede7] relative size-full" data-name="New Note">
      <p className="-translate-x-1/2 absolute font-['DM_Mono:Regular',sans-serif] leading-[normal] left-1/2 not-italic text-[#5a4a35] text-[14px] text-center top-[72px]">LifeNote · Day 55</p>
      <Group />
      <div className="-translate-x-1/2 absolute bottom-[-40.7px] flex h-[233.476px] items-center justify-center left-[calc(50%+0.41px)] w-[354.196px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "76" } as React.CSSProperties}>
        <div className="flex-none rotate-[-0.12deg]">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}