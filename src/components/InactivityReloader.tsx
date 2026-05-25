import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Recarrega a página após um período de inatividade do usuário logado,
 * garantindo que ele receba as últimas atualizações da aplicação.
 */
const INACTIVITY_MS = 20 * 60 * 1000; // 20 minutos

export const InactivityReloader = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    let timer: number | undefined;

    const reload = () => {
      // evita recarregar enquanto há formulários/uploads ativos
      const isTyping =
        document.activeElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (document.activeElement as HTMLElement).tagName
        );
      if (isTyping) {
        reset();
        return;
      }
      window.location.reload();
    };

    const reset = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(reload, INACTIVITY_MS);
    };

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "focus",
    ];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    const onVisibility = () => {
      if (!document.hidden) reset();
    };
    document.addEventListener("visibilitychange", onVisibility);

    reset();

    return () => {
      if (timer) window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [user]);

  return null;
};
