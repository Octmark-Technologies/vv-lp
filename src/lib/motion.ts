/** Inline <head> script: enables hidden initial states only when JS runs and reduced-motion is off. */
export const motionBootScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')}catch(e){}`;
