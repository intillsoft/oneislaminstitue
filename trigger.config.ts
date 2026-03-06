import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
    project: "proj_vohkwokfncwursdhnofe", // Replace with your actual project ref if different
    runtime: "node",
    logLevel: "info",
    // Explicitly set the directory to find tasks
    dirs: ["./src/trigger"],
    retries: {
        default: {
            maxAttempts: 3,
            minTimeoutInMs: 1000,
            maxTimeoutInMs: 10000,
            factor: 2,
            randomize: true,
        },
    },
    maxDuration: 60, // 60 seconds default
    build: {
        external: [
            "chromium-bidi",
            "chromium-bidi/lib/cjs/bidiMapper/BidiMapper",
            "chromium-bidi/lib/cjs/cdp/CdpConnection",
            "playwright-core",
            "playwright",
            "@browserbasehq/stagehand",
            "zod"
        ],
    },
});
