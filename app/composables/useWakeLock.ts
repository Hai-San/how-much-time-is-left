export const useWakeLock = () => {
  let sentinel: WakeLockSentinel | null = null;
  let desired = false;
  let target: Window | null = import.meta.client ? window : null;

  const supported = (win: Window | null): win is Window => !!win && 'wakeLock' in win.navigator;

  const acquire = async () => {
    if (!supported(target) || sentinel || target.document.visibilityState !== 'visible') {
      return;
    }

    try {
      sentinel = await target.navigator.wakeLock.request('screen');
      sentinel.addEventListener('release', () => {
        sentinel = null;
      });
    } catch {
      // NotAllowedError (sem foco, economia de bateria, etc.) - ignora
    }
  };

  const release = () => {
    sentinel?.release();
    sentinel = null;
  };

  const enable = () => {
    desired = true;
    acquire();
  };

  const disable = () => {
    desired = false;
    release();
  };

  const onVisibility = () => {
    if (desired) {
      acquire();
    }
  };

  const setTarget = (win: Window) => {
    if (!import.meta.client || win === target) {
      return;
    }

    target?.document.removeEventListener('visibilitychange', onVisibility);
    release();
    target = win;
    target.document.addEventListener('visibilitychange', onVisibility);

    if (desired) {
      acquire();
    }
  };

  if (target) {
    target.document.addEventListener('visibilitychange', onVisibility);
  }

  onBeforeUnmount(() => {
    target?.document.removeEventListener('visibilitychange', onVisibility);
    disable();
  });

  return { enable, disable, setTarget };
};
