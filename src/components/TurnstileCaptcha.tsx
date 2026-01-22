import React, { useEffect, useRef } from "react";

interface TurnstileCaptchaProps {
    sitekey: string;
    onVerify: (token: string) => void;
    className?: string;
}

declare global {
    interface Window {
        onloadTurnstileCallback: () => void;
        turnstile: {
            render: (
                container: string | HTMLElement,
                options: {
                    sitekey: string;
                    callback: (token: string) => void;
                    "error-callback"?: () => void;
                    "expired-callback"?: () => void;
                }
            ) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
        };
    }
}

export const TurnstileCaptcha: React.FC<TurnstileCaptchaProps> = ({
    sitekey,
    onVerify,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useEffect(() => {
        // 1. Script injection
        if (!document.getElementById("turnstile-script")) {
            const script = document.createElement("script");
            script.id = "turnstile-script";
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }

        // 2. Rendering helper
        const renderTurnstile = () => {
            if (window.turnstile && containerRef.current && !widgetIdRef.current) {
                try {
                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey,
                        callback: (token: string) => {
                            onVerify(token);
                        },
                        "error-callback": () => {
                            console.error("Turnstile error");
                        },
                        "expired-callback": () => {
                            onVerify("");
                        },
                    });
                } catch (e) {
                    console.error("Failed to render Turnstile:", e);
                }
            }
        };

        // 3. Wait for turnstile to be ready or render immediately if it is
        if (window.turnstile) {
            renderTurnstile();
        } else {
            // Periodic check as a fallback if onloadTurnstileCallback is not used
            const interval = setInterval(() => {
                if (window.turnstile) {
                    renderTurnstile();
                    clearInterval(interval);
                }
            }, 500);
            return () => clearInterval(interval);
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                // window.turnstile.remove(widgetIdRef.current);
                // widgetIdRef.current = null;
            }
        };
    }, [sitekey, onVerify]);

    return (
        <div className={className}>
            <div ref={containerRef} id="cf-turnstile-container"></div>
        </div>
    );
};
