import { execSync } from "child_process";
import { tmpdir } from "os";
import { join } from "path";

const outDir = join(tmpdir(), ".dist");

console.log("Running test build...");

try {
  // Use pnpm exec instead of npx to avoid npm config warnings
  execSync(`pnpm exec vite build --minify false --logLevel error --outDir "${outDir}"`, {
    stdio: "inherit",
    env: {
      ...process.env,
      // Suppress npm warnings
      NPM_CONFIG_LOGLEVEL: "error",
    },
  });
  console.log("✅ Test build completed successfully.");
} catch (error) {
  console.error("❌ Test build failed.");
  process.exit(1);
}
