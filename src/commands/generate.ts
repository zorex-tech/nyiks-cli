import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { __dirname } from "../utils/paths.js";

const command = new Command("generate");
const SIP009_TRAITS: Record<string, string> = {
  mainnet: "'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait",
  testnet: "'ST000000000000000000002AMW42H.sip009-nft-standard",
};

async function getAvailableTypes(): Promise<string[]> {
  const templatesDir = path.join(__dirname, "..", "templates");
  const files = await fs.readdir(templatesDir);
  return files
    .filter((file) => file.endsWith(".clar"))
    .map((file) => path.basename(file, ".clar"));
}
export function generateCommand() {
  command
    .requiredOption("--name <string>", "Name of the contract")
    .requiredOption("--type <string>", "Type of contract, e.g., 'ft'")
    .option("--max-supply <number>", "Maximum supply of token")
    .option("--symbol <string>", "Symbol of the token")
    .option(
      "--network <string>",
      "Stacks network: 'mainnet' or 'testnet'",
      "mainnet"
    )
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
        // Validate contract type
        const allowedTypes = await getAvailableTypes();
        if (!allowedTypes.includes(options.type)) {
          console.log(chalk.red(`❌ Invalid contract type: ${options.type}`));
          process.exit(1);
        }

        // Validate network
        if (!["mainnet", "testnet"].includes(options.network)) {
          console.log(
            chalk.red("❌ Invalid network. Use 'mainnet' or 'testnet'.")
          );
          process.exit(1);
        }
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

      // Replace trait only for NFT
      if (options.type === "nft") {
        const trait = SIP009_TRAITS[options.network];
        template = template.replace(/__TRAIT__/g, trait);
      }

      await fs.writeFile(outputPath, template);

      console.log(chalk.green(`✅ Generated contract at ${outputPath}`));
    });

  return command;
}
