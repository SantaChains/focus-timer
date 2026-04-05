import { execSync } from "child_process";
import { existsSync } from "fs";
import { join, resolve } from "path";

const rulesDir = resolve(process.cwd(), ".rules");

const ruleFiles = [
  "SelectItem.yml",
  "contrast.yml",
  "supabase-google-sso.yml",
  "toast-hook.yml",
  "slot-nesting.yml",
  "require-button-interaction.yml",
  "supabase-edge-function-get-body.yml",
];

function runAstGrep(ruleFile) {
  const rulePath = join(rulesDir, ruleFile);
  if (existsSync(rulePath)) {
    try {
      execSync(`ast-grep scan -r "${rulePath}"`, { stdio: "inherit" });
    } catch {
      // ast-grep may exit with non-zero if matches found
    }
  }
}

console.log("Running ast-grep rules...\n");

for (const ruleFile of ruleFiles) {
  runAstGrep(ruleFile);
}

const useAuthRule = join(rulesDir, "useAuth.yml");
const authProviderRule = join(rulesDir, "authProvider.yml");

if (existsSync(useAuthRule)) {
  let useAuthOutput = "";
  try {
    useAuthOutput = execSync(`ast-grep scan -r "${useAuthRule}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (e) {
    useAuthOutput = e.stdout || "";
  }

  if (useAuthOutput.trim()) {
    let authProviderOutput = "";
    try {
      authProviderOutput = execSync(`ast-grep scan -r "${authProviderRule}"`, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch (e) {
      authProviderOutput = e.stdout || "";
    }

    if (!authProviderOutput.trim()) {
      console.log("\n=== ast-grep scan -r .rules/useAuth.yml output ===");
      console.log(useAuthOutput);
      console.log("\n=== ast-grep scan -r .rules/authProvider.yml output ===");
      console.log(authProviderOutput);
      console.log("\n⚠️  Issue detected:");
      console.log(
        "The code uses useAuth Hook but does not have AuthProvider component wrapping the components."
      );
      console.log(
        "Please ensure that components using useAuth are wrapped with AuthProvider to provide proper authentication context."
      );
      console.log("\nSuggested fixes:");
      console.log(
        "1. Add AuthProvider wrapper in app.tsx or corresponding root component"
      );
      console.log(
        "2. Ensure all components using useAuth are within AuthProvider scope"
      );
    }
  }
}

console.log("\n✅ Check completed.");
