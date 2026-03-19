const { execSync } = require("child_process");

const branch = "claude/website-improvements-GRFtX";

const commands = [
  "git checkout main",
  "git pull origin main",
  `git merge ${branch}`,
  "git push origin main",
];

for (const cmd of commands) {
  console.log(`> ${cmd}`);
  try {
    const output = execSync(cmd, { encoding: "utf-8" });
    if (output) console.log(output.trim());
  } catch (err) {
    console.error(`Failed: ${err.message}`);
    process.exit(1);
  }
}

console.log("Merge complete!");
