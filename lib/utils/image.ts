export const getImageUrl = (path?: string) => {
    if (!path) return "/default-avatar.png";
    if (path.startsWith("http")) return path;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // ensure the path has a leading slash if it doesn't have one and baseUrl doesn't end with one
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    return `${cleanBaseUrl}${cleanPath}`;
};
