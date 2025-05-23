// src/assets/preloader.ts

export function getPreloadImageList(): string[] {
    const context = (require as any).context('./', true, /\.(png|jpe?g|svg)$/);
    return context.keys()
        .filter((path: string) => {
            // Limit to small, critical images only (adjust as needed)
            return (
                path.includes('logo') ||
                path.includes('background') ||
                path.includes('splash')
            );
        })
        .map((path: string) => 'assets/' + path.replace('./', ''));
}
