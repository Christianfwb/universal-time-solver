// state.js — zentrales Zustandsobjekt mit Publish/Subscribe.
export function createStore(initial) {
  const state = { ...initial };
  const subs = new Set();
  return {
    get: () => state,
    set(patch) {
      Object.assign(state, patch);
      for (const fn of subs) fn(state);
    },
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
  };
}
