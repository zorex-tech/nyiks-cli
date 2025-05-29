import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { __dirname } from "../utils/paths.js";

export function generateCommand() {
  const command = new Command("generate");

  command
    .requiredOption("--name <string>", "Name of the contract")
    .requiredOption("--type <string>", "Type of contract, e.g., 'ft'")
    .option("--max-supply <number>", "Maximum supply of token")
    .option("--symbol <string>", "Symbol of the token")
    .description("Generate a new smart contract from a template")
    .action(async (options) => {
      const cwd = process.cwd();
      const contractsDir = path.join(cwd, "contracts");

      // Check if contracts directory exists
      if (!(await fs.pathExists(contractsDir))) {
        console.log(
          chalk.red(
            "❌ No contracts directory found. Did you run `nyiks init <projectName>`?"
          )
        );
        process.exit(1);
      }

      // Determine output file path
      const safeName = options.name.toLowerCase().replace(/\s+/g, "-");
      const outputPath = path.join(contractsDir, `${safeName}.clar`);

      // Load and customize template
      const templatePath = path.join(
        __dirname,
        "..",
        "templates",
        `${options.type}.clar`
      );
      if (!(await fs.pathExists(templatePath))) {
        console.log(
          chalk.red(`❌ Template for type "${options.type}" not found.`)
        );
        process.exit(1);
      }

      let template = await fs.readFile(templatePath, "utf-8");
      template = template
        .replace(/__NAME__/g, options.name)
        .replace(/__SYMBOL__/g, options.symbol || "SYM")
        .replace(/__MAX_SUPPLY__/g, options.maxSupply || "1000000");

      await fs.writeFile(outputPath, template);

      console.log(chalk.green(`✅ Generated contract at ${outputPath}`));
    });

  return command;
}
