// useCustomSearchSpace — when set, the TTM and ROI calculators use this
// configuration instead of their built-in sliders. Written by the Knob
// Explorer's "Apply to TTM/ROI" buttons; read by both calculators.
//
// Shape: { configs: number, source: "knob-explorer", appliedAt: ISO-string } | null
//
// Sits on top of useSharedSetting so the value persists across reloads and
// syncs between tabs (storage event).
import { useSharedSetting } from "./useSharedSetting";

const KEY = "traigent_custom_search_space";

export function useCustomSearchSpace() {
  const [value, setValue] = useSharedSetting(KEY, null);
  function apply(configs) {
    setValue({
      configs,
      source: "knob-explorer",
      appliedAt: new Date().toISOString(),
    });
  }
  function reset() {
    setValue(null);
  }
  return [value, apply, reset];
}
