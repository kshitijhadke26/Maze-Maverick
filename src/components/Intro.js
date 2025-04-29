import React, { useEffect, useState } from "react";
import { GiMazeSaw } from "react-icons/gi";

const Intro = () => {
	const [animationFinished, setAnimationFinished] = useState(false);
	const [startAnimation, setStartAnimation] = useState(false);
	const [hideScreen, setHideScreen] = useState(false);

	useEffect(() => {
		const timeout1 = setTimeout(() => setStartAnimation(true), 100);
		const timeout2 = setTimeout(() => setAnimationFinished(true), 2000);
		const timeout3 = setTimeout(() => setHideScreen(true), 2800);

		return () => {
			clearTimeout(timeout1);
			clearTimeout(timeout2);
			clearTimeout(timeout3);
		};
	}, []);

	return (
		<div
			className={`fixed z-50 left-0 top-0 w-screen h-screen bg-slate-950 transition-all duration-1000 flex justify-center items-center
        ${animationFinished ? "opacity-0 blur-sm" : "opacity-100"}
        ${hideScreen ? "hidden" : ""}
      `}>
			<div
				className={`transition-all duration-[1200ms] ease-in-out transform text-white
          ${startAnimation ? "scale-[4] rotate-[720deg]" : "scale-0 rotate-0"}
          ${
				animationFinished
					? "opacity-0 translate-y-20"
					: "opacity-100 translate-y-0"
			}
        `}>
				<GiMazeSaw className="text-[4rem] sm:text-[6rem] md:text-[8rem] text-cyan-400 drop-shadow-lg" />
				<p className="text-center mt-4 text-sm tracking-wide uppercase opacity-60">
					Maze Maverick
				</p>
			</div>
		</div>
	);
};

export default Intro;
