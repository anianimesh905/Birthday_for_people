export function getVisitCount() {
  return parseInt(localStorage.getItem("visitCount") || "0");
}

export function incrementVisitCount() {
  const current = getVisitCount();
  localStorage.setItem("visitCount", String(current + 1));
  return current + 1;
}

export function isSpellUnlocked(spellName) {
  return localStorage.getItem(`spell_${spellName.toLowerCase()}`) === "true";
}

export function unlockSpell(spellName) {
  localStorage.setItem(`spell_${spellName.toLowerCase()}`, "true");
}
