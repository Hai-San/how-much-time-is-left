interface PipCapableWindow extends Window {
  documentPictureInPicture: {
    requestWindow: (_options?: { width?: number; height?: number }) => Promise<Window>;
  };
}

interface PipOptions {
  onOpen?: (_win: Window) => void;
  onClose?: () => void;
}

export const useDocumentPip = (options: PipOptions = {}) => {
  const isActive = ref(false);
  const isSupported = import.meta.client && 'documentPictureInPicture' in window;

  let pipWindow: Window | null = null;
  let parent: Node | null = null;
  let nextSibling: Node | null = null;

  const copyStyles = (target: Window) => {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const css = Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('');
        const style = target.document.createElement('style');
        style.textContent = css;
        target.document.head.appendChild(style);
      } catch {
        if (sheet.href) {
          const link = target.document.createElement('link');
          link.rel = 'stylesheet';
          link.href = sheet.href;
          target.document.head.appendChild(link);
        }
      }
    }
  };

  const open = async (content: HTMLElement) => {
    if (!isSupported || isActive.value) {
      return;
    }

    pipWindow = await (
      window as unknown as PipCapableWindow
    ).documentPictureInPicture.requestWindow({ width: 320, height: 220 });

    copyStyles(pipWindow);
    pipWindow.document.documentElement.setAttribute(
      'data-theme',
      document.documentElement.getAttribute('data-theme') ?? 'light',
    );

    const { body } = pipWindow.document;
    body.style.margin = '0';
    body.style.minHeight = '100vh';
    body.style.display = 'flex';
    body.style.alignItems = 'center';
    body.style.justifyContent = 'center';

    parent = content.parentNode;
    nextSibling = content.nextSibling;
    pipWindow.document.body.append(content);

    pipWindow.addEventListener(
      'pagehide',
      () => {
        parent?.insertBefore(content, nextSibling);
        isActive.value = false;
        pipWindow = null;
        options.onClose?.();
      },
      { once: true },
    );

    isActive.value = true;
    options.onOpen?.(pipWindow);
  };

  const close = () => {
    pipWindow?.close();
  };

  const toggle = (content: HTMLElement) => {
    if (isActive.value) {
      close();
    } else {
      open(content);
    }
  };

  onBeforeUnmount(() => {
    if (isActive.value) {
      close();
    }
  });

  return { isActive, isSupported, toggle };
};
