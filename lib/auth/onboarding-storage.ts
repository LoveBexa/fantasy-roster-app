const STORAGE_KEY = "the-roster-dashboard-onboarding-dismissed"

export function isOnboardingDismissedLocally() {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(STORAGE_KEY) === "1"
}

export function setOnboardingDismissedLocally() {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, "1")
}
