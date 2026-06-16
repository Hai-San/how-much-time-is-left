type PomodoroPhase = 'focus' | 'short' | 'long';

const FOCUS = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const CYCLES_BEFORE_LONG = 4;

const STORAGE_KEY = 'pomodoro-state';
const MAX_SESSION_MS = 8 * 60 * 60 * 1000;

const phaseDuration: Record<PomodoroPhase, number> = {
  focus: FOCUS,
  short: SHORT_BREAK,
  long: LONG_BREAK,
};

export const usePomodoro = () => {
  const { t } = useI18n();
  const phase = ref<PomodoroPhase>('focus');
  const secondsLeft = ref(FOCUS);
  const isRunning = ref(false);
  const completedFocus = ref(0);
  const workedSeconds = ref(0);
  const goalHours = ref(6);
  const goalMinutes = ref(0);

  const wakeLock = useWakeLock();
  const pip = useDocumentPip({
    onOpen: (win) => wakeLock.setTarget(win),
    onClose: () => wakeLock.setTarget(window),
  });

  let intervalId: ReturnType<typeof setInterval> | null = null;

  const stopInterval = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const nextPhase = () => {
    if (phase.value === 'focus') {
      completedFocus.value += 1;
      phase.value = completedFocus.value % CYCLES_BEFORE_LONG === 0 ? 'long' : 'short';
    } else {
      phase.value = 'focus';
    }

    secondsLeft.value = phaseDuration[phase.value];
  };

  const tick = () => {
    if (phase.value === 'focus') {
      workedSeconds.value += 1;
    }

    if (secondsLeft.value > 0) {
      secondsLeft.value -= 1;
    }

    if (secondsLeft.value === 0) {
      nextPhase();
    }
  };

  const start = () => {
    if (!import.meta.client || isRunning.value) {
      return;
    }

    isRunning.value = true;
    stopInterval();
    intervalId = setInterval(tick, 1000);
  };

  const pause = () => {
    isRunning.value = false;
    stopInterval();
  };

  const toggle = () => {
    if (isRunning.value) {
      pause();
    } else {
      start();
    }
  };

  const reset = () => {
    pause();
    phase.value = 'focus';
    completedFocus.value = 0;
    secondsLeft.value = FOCUS;
    workedSeconds.value = 0;
  };

  const formatHM = (total: number) => {
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const formattedTime = computed(() => {
    const minutes = Math.floor(secondsLeft.value / 60);
    const seconds = secondsLeft.value % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  const workedFormatted = computed(() => formatHM(workedSeconds.value));

  const goalFormatted = computed(() => formatHM(goalHours.value * 3600 + goalMinutes.value * 60));

  const phaseLabel = computed(() => t(`phase.${phase.value}`));

  const persist = () => {
    if (!import.meta.client) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        phase: phase.value,
        secondsLeft: secondsLeft.value,
        completedFocus: completedFocus.value,
        workedSeconds: workedSeconds.value,
        goalHours: goalHours.value,
        goalMinutes: goalMinutes.value,
        isRunning: isRunning.value,
        savedAt: Date.now(),
      }),
    );
  };

  const restore = () => {
    if (!import.meta.client) {
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const age = Date.now() - (data.savedAt ?? 0);

    if (age > MAX_SESSION_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    phase.value = data.phase;
    secondsLeft.value = data.secondsLeft;
    completedFocus.value = data.completedFocus;
    workedSeconds.value = data.workedSeconds;
    goalHours.value = data.goalHours;
    goalMinutes.value = data.goalMinutes;

    if (data.isRunning) {
      const elapsed = Math.floor(age / 1000);

      for (let i = 0; i < elapsed; i++) {
        tick();
      }

      start();
    }
  };

  watch(isRunning, (running) => {
    if (running) {
      wakeLock.enable();
    } else {
      wakeLock.disable();
    }
  });

  restore();

  watch(
    [phase, secondsLeft, isRunning, completedFocus, workedSeconds, goalHours, goalMinutes],
    persist,
  );

  onBeforeUnmount(() => {
    stopInterval();
  });

  return {
    phaseLabel,
    isRunning,
    formattedTime,
    workedFormatted,
    goalFormatted,
    goalHours,
    goalMinutes,
    toggle,
    reset,
    togglePip: pip.toggle,
    isPipActive: pip.isActive,
    pipSupported: pip.isSupported,
  };
};
