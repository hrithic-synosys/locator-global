'use client';

// Scroll selects a visual state; it never locks or changes the page position.
// Nearby state changes animate. A fast jump resolves directly to the requested
// frame, and reversing mid-transition reverses the same timeline immediately.
export function createSectionMachine({ states, forward, backward, runTransition, applyState }) {
  let trigger = null;
  let state = 0;
  let progress = 0;
  let busy = false;
  let transitionFrom = null;
  let skipping = false;
  let dead = false;
  let generation = 0;

  const stateAt = (p) => {
    let target = 0;
    for (let i = 1; i < states; i++) if (p >= forward[i]) target = i;
    return target;
  };

  const resolve = (target) => {
    if (dead) return;
    generation++;
    state = target;
    busy = false;
    transitionFrom = null;
    applyState(target);
  };

  const settle = () => {
    if (dead || skipping || !trigger) return;
    if (!trigger.isActive) {
      const target = stateAt(progress);
      if (busy || target !== state) resolve(target);
      return;
    }

    // Direction-dependent boundaries prevent jitter around a threshold.
    let target = state;
    while (target < states - 1 && progress >= forward[target + 1]) target++;
    while (target > 0 && progress <= backward[target - 1]) target--;
    if (target === state) return;

    // Do not queue animations behind a fast scroll. Only an immediate reversal
    // can reuse a partially played transition; other interruptions settle now.
    if (Math.abs(target - state) > 1 || (busy && target !== transitionFrom)) {
      resolve(target);
      return;
    }

    const from = state;
    const ticket = ++generation;
    state = target;
    transitionFrom = from;
    busy = true;
    runTransition(from, target, () => {
      if (dead || ticket !== generation) return;
      busy = false;
      transitionFrom = null;
      applyState(state);
      settle();
    });
  };

  return {
    setTrigger(next) {
      if (busy) resolve(state);
      trigger = next;
    },
    onScroll(self) { progress = self.progress; settle(); },
    onRefresh(self) {
      progress = self.progress;
      const target = stateAt(progress);
      if (busy || target !== state) resolve(target);
    },
    onLeave() { progress = 1; resolve(states - 1); },
    onLeaveBack() { progress = 0; resolve(0); },
    showStatic() { resolve(states - 1); },
    reset() { resolve(0); },
    skip(direction) {
      if (dead || skipping) return;
      skipping = true;
      resolve(direction === 'up' ? 0 : states - 1);
    },
    endSkip() {
      if (!skipping) return;
      skipping = false;
      if (trigger) progress = trigger.progress;
      settle();
    },
    getState() { return state; },
    isBusy() { return busy; },
    isSkipping() { return skipping; },
    destroy() { dead = true; generation++; trigger = null; busy = false; },
  };
}
