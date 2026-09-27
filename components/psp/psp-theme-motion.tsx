"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PspThemeName } from "./psp-themes";

const mirror = (duration: number) => ({ duration, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const });
const linear = (duration: number) => ({ duration, repeat: Infinity, ease: "linear" as const });
const points = Array.from({ length: 24 }, (_, index) => ({ left: `${(index * 37 + 9) % 96}%`, size: 1 + index % 3, delay: (index % 8) * .45 }));
const slateGlints = Array.from({ length: 14 }, (_, index) => ({
  left: `${(index * 43 + 7) % 94}%`,
  top: `${(index * 31 + 11) % 82}%`,
  delay: (index % 7) * 0.8,
}));

export function PspThemeMotion({ theme, reduced }: { theme: PspThemeName; reduced: boolean }) {
  return <AnimatePresence mode="wait"><motion.div key={theme} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.45}} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    {theme === "slate" && <>
      {[0, 1, 2].map((index) => <motion.div key={index} className="absolute h-[130%] w-[23%] -skew-x-12 bg-gradient-to-b from-white/[0.015] via-slate-300/[0.055] to-transparent blur-2xl" style={{left:`${10 + index * 31}%`,top:"-18%"}} animate={reduced?undefined:{x:[-28 + index * 8,34 - index * 5,-28 + index * 8],opacity:[.35,.72,.35]}} transition={mirror(14 + index * 4)}/>) }
      {slateGlints.map((glint,index) => <motion.span key={index} className="absolute h-1 w-1 rounded-full bg-slate-200/45 shadow-[0_0_9px_rgba(203,213,225,.4)]" style={{left:glint.left,top:glint.top}} animate={reduced?undefined:{opacity:[.08,.65,.08],scale:[.7,1.25,.7],y:[0,-8,0]}} transition={{...mirror(6 + index % 4),delay:glint.delay}}/>) }
    </>}
    {theme === "classic" && <motion.div className="absolute -left-[20%] bottom-[2%] h-[42%] w-[142%] rounded-[48%] bg-blue-300/[0.07] blur-sm" animate={reduced?undefined:{x:[-55,70,-55],y:[10,-34,10],rotate:[-2,3,-2]}} transition={mirror(11)}/>}
    {theme === "aurora" && <>{[["left-[3%]","from-violet-500/5 via-violet-400/25 to-transparent",-12],["left-[34%]","from-cyan-400/5 via-cyan-300/20 to-transparent",8],["right-[1%]","from-fuchsia-500/5 via-fuchsia-400/18 to-transparent",-6]].map(([position,colour,rotate],index)=><motion.div key={String(position)} className={`absolute -top-[25%] h-[145%] w-[34%] rounded-[50%] bg-gradient-to-b blur-3xl ${position} ${colour}`} initial={{rotate:Number(rotate)}} animate={reduced?undefined:{x:[0,index%2?85:-68,0],rotate:[Number(rotate),Number(rotate)+13,Number(rotate)],scaleX:[.82,1.18,.82],opacity:[.38,.76,.38]}} transition={mirror(8+index*2)}/>)}</>}
    {theme === "ember" && <><motion.div className="absolute -bottom-[28%] left-[8%] h-[65%] w-[84%] rounded-[50%] bg-orange-500/14 blur-[70px]" animate={reduced?undefined:{scale:[.92,1.1,.92],opacity:[.4,.75,.4],y:[0,-22,0]}} transition={mirror(6)}/>{points.map((point,index)=><motion.span key={index} className="absolute bottom-[-4%] rounded-full bg-orange-200 shadow-[0_0_8px_rgba(255,125,45,.8)]" style={{left:point.left,width:point.size+1,height:point.size+1}} animate={reduced?undefined:{y:[0,-(320+(index%5)*60)],x:[0,index%2?25:-22],opacity:[0,.8,0]}} transition={{...linear(6+index%6),delay:point.delay}}/>)}</>}
    {theme === "pop" && <>{[["left-[8%] top-[18%] h-24 w-24 bg-[#ff3d9a]",9,36],["right-[11%] top-[12%] h-36 w-36 bg-[#31dcff]",12,-44],["right-[28%] bottom-[8%] h-20 w-20 bg-[#fff06a]",7,28],["left-[38%] bottom-[13%] h-14 w-14 bg-[#8f63ff]",10,-32]].map(([classes,duration,travel],index)=><motion.div key={String(classes)} className={`absolute rounded-full opacity-25 blur-[1px] ${classes}`} animate={reduced?undefined:{y:[0,Number(travel),0],x:[0,index%2?18:-18,0],scale:[1,1.12,1]}} transition={mirror(Number(duration))}/>)}</>}
    {theme === "deep-space" && <>
      <motion.div className="absolute -right-[8%] top-[4%] h-[62%] w-[58%] rounded-full bg-indigo-600/10 blur-[100px]" animate={reduced?undefined:{scale:[.9,1.08,.9],x:[0,-32,0],opacity:[.38,.7,.38]}} transition={mirror(16)}/>
      <motion.div className="absolute -bottom-[18%] left-[4%] h-[52%] w-[62%] rounded-full bg-fuchsia-700/[0.07] blur-[110px]" animate={reduced?undefined:{x:[-18,46,-18],y:[0,-24,0],opacity:[.25,.55,.25]}} transition={mirror(21)}/>
      {points.map((point,index) => <motion.span key={index} className="absolute rounded-full bg-blue-100" style={{left:point.left,top:`${(index * 47 + 5) % 90}%`,width:point.size,height:point.size}} animate={reduced?undefined:{opacity:[.15,index%5===0?.95:.55,.15],scale:[.7,index%5===0?1.8:1.15,.7]}} transition={{...mirror(4 + index % 6),delay:point.delay}}/>) }
      <motion.div className="absolute right-[13%] top-[18%] h-24 w-24 rounded-full border border-blue-200/10" animate={reduced?undefined:{rotate:[0,360],scale:[1,1.04,1]}} transition={linear(28)}><span className="absolute -right-1 top-1/2 h-2 w-2 rounded-full bg-blue-200/60 shadow-[0_0_12px_rgba(160,190,255,.8)]"/></motion.div>
    </>}
  </motion.div></AnimatePresence>;
}
