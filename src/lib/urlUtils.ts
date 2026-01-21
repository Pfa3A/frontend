export const getMediaUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    // Remove trailing slash from base and leading slash from path
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${normalizedBase}${normalizedPath}`;
};
