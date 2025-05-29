// #!/usr/bin/env node

// import { Command } from "commander";
// import chalk from "chalk";
// import inquirer from "inquirer";
// import fs from "fs-extra";
// import path from "path";

// interface ContractAnswers {
//   name?: string;
//   symbol?: string;
//   maxSupply?: string;
// }

// const program = new Command();
// program
//   .version("1.0.0")
//   .description("Nyiks CLI - Stacks Smart Contract Generator");

// const templatesDir = path.join(__dirname, "../templates");

// // INIT Command
// program
//   .command("init <projectName>")
//   .description("Initialize a new Nyiks project")
//   .action((projectName: string) => {
//     const projectPath = path.join(process.cwd(), projectName);
//     if (fs.existsSync(projectPath)) {
//       console.log(chalk.red(`❌ Project "${projectName}" already exists.`));
//       process.exit(1);
//     }

//     fs.mkdirSync(projectPath);
//     fs.mkdirSync(path.join(projectPath, "contracts"));
//     console.log(chalk.green(`📁 Project "${projectName}" created.`));
//   });

// // GENERATE Command
// program
//   .command("generate [type]")
//   .description("Generate a smart contract")
//   .option("--name <name>", "Contract name")
//   .option("--symbol <symbol>", "Token symbol")
//   .option("--max-supply <maxSupply>", "Max supply for FT")
//   .action(
//     async (
//       type: string,
//       options: { name?: string; symbol?: string; maxSupply?: string }
//     ) => {
//       let contractType = type;
//       let { name, symbol, maxSupply } = options;

//       if (!contractType) {
//         const answers = await inquirer.prompt([
//           {
//             type: "list",
//             name: "type",
//             message: "Select contract type:",
//             choices: ["ft", "nft"],
//           },
//         ]);
//         contractType = answers.type;
//       }

//       // For Inquirer v12, use a simple array without explicit typing
//       const questions = [];

//       if (!name) {
//         questions.push({
//           type: "input",
//           name: "name",
//           message: "Token Name:",
//         });
//       }

//       if (!symbol) {
//         questions.push({
//           type: "input",
//           name: "symbol",
//           message: "Token Symbol:",
//         });
//       }

//       if (contractType === "ft" && !maxSupply) {
//         questions.push({
//           type: "input",
//           name: "maxSupply",
//           message: "Max Supply:",
//         });
//       }

//       if (questions.length) {
//         const answers = await inquirer.prompt(questions);
//         name = name || answers.name;
//         symbol = symbol || answers.symbol;
//         maxSupply = maxSupply || answers.maxSupply;
//       }

//       const projectPath = process.cwd();
//       const contractsDir = path.join(projectPath, "contracts");
//       if (!fs.existsSync(contractsDir)) {
//         console.log(
//           chalk.red(
//             `❌ Contracts directory not found. Run 'nyiks init <project>' first.`
//           )
//         );
//         process.exit(1);
//       }

//       // Generate contract content
//       let contractContent = "";
//       const fileName = `${contractType}-${name || "example"}.clar`;

//       if (contractType === "ft") {
//         contractContent = `// Fungible Token Contract
// (define-fungible-token ${symbol || "TOKEN"})
// (define-constant max-supply u${maxSupply || 1000000})

// ;; Error constants
// (define-constant ERR-UNAUTHORIZED (err u100))
// (define-constant ERR-NOT-TOKEN-OWNER (err u101))
// (define-constant ERR-INSUFFICIENT-BALANCE (err u102))

// ;; Token transfer function
// (define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
//   (begin
//     (asserts! (is-eq tx-sender sender) ERR-UNAUTHORIZED)
//     (ft-transfer? ${symbol || "TOKEN"} amount sender recipient)
//   )
// )

// ;; Get token balance
// (define-read-only (get-balance (who principal))
//   (ft-get-balance ${symbol || "TOKEN"} who)
// )

// ;; Get token name
// (define-read-only (get-name)
//   (ok "${name || "Example Token"}")
// )

// ;; Get token symbol
// (define-read-only (get-symbol)
//   (ok "${symbol || "TOKEN"}")
// )

// ;; Get decimals
// (define-read-only (get-decimals)
//   (ok u6)
// )

// ;; Get total supply
// (define-read-only (get-total-supply)
//   (ok (ft-get-supply ${symbol || "TOKEN"}))
// )

// ;; Mint function (only contract owner)
// (define-public (mint (amount uint) (recipient principal))
//   (begin
//     (asserts! (is-eq tx-sender contract-caller) ERR-UNAUTHORIZED)
//     (ft-mint? ${symbol || "TOKEN"} amount recipient)
//   )
// )`;
//       } else if (contractType === "nft") {
//         contractContent = `// Non-Fungible Token Contract
// (define-non-fungible-token ${symbol || "NFT"} uint)

// ;; Error constants
// (define-constant ERR-UNAUTHORIZED (err u100))
// (define-constant ERR-NOT-TOKEN-OWNER (err u101))
// (define-constant ERR-TOKEN-EXISTS (err u102))
// (define-constant ERR-TOKEN-NOT-FOUND (err u103))

// ;; Storage
// (define-map token-count principal uint)
// (define-data-var last-token-id uint u0)

// ;; Get last token ID
// (define-read-only (get-last-token-id)
//   (ok (var-get last-token-id))
// )

// ;; Get token owner
// (define-read-only (get-owner (token-id uint))
//   (ok (nft-get-owner? ${symbol || "NFT"} token-id))
// )

// ;; Transfer function
// (define-public (transfer (token-id uint) (sender principal) (recipient principal))
//   (begin
//     (asserts! (is-eq tx-sender sender) ERR-UNAUTHORIZED)
//     (asserts! (is-eq (some sender) (nft-get-owner? ${
//       symbol || "NFT"
//     } token-id)) ERR-NOT-TOKEN-OWNER)
//     (nft-transfer? ${symbol || "NFT"} token-id sender recipient)
//   )
// )

// ;; Mint function
// (define-public (mint (recipient principal))
//   (let
//     (
//       (token-id (+ (var-get last-token-id) u1))
//     )
//     (asserts! (is-eq tx-sender contract-caller) ERR-UNAUTHORIZED)
//     (try! (nft-mint? ${symbol || "NFT"} token-id recipient))
//     (var-set last-token-id token-id)
//     (ok token-id)
//   )
// )

// ;; Get token count for owner
// (define-read-only (get-balance (owner principal))
//   (default-to u0 (map-get? token-count owner))
// )`;
//       } else {
//         console.log(chalk.red(`❌ Unknown contract type "${contractType}".`));
//         process.exit(1);
//       }

//       const filePath = path.join(contractsDir, fileName);
//       fs.writeFileSync(filePath, contractContent);
//       console.log(
//         chalk.green(
//           `✅ ${contractType.toUpperCase()} contract generated at ${filePath}`
//         )
//       );
//     }
//   );

// program.parse(process.argv);


import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

export function initCommand() {
  const command = new Command("init");

  command
    .argument("<projectName>", "Name of the new project")
    .description("Initialize a new Nyiks project")
    .action(async (projectName) => {
      const projectPath = path.join(process.cwd(), projectName);

      // Check if project directory already exists
      if (await fs.pathExists(projectPath)) {
        console.log(
          chalk.red(
            `❌ Project "${projectName}" already exists at ${projectPath}.`
          )
        );
        process.exit(1);
      }

      // Create project directory and contracts subdirectory
      await fs.mkdirp(path.join(projectPath, "contracts"));

      console.log(chalk.green(`📁 Created project directory: ${projectPath}`));
      console.log(chalk.blue(`📂 Created contracts directory inside.`));

      // Optional: Create a basic README
      const readmePath = path.join(projectPath, "README.md");
      await fs.writeFile(
        readmePath,
        `# ${projectName}\n\nSmart contracts generated by Nyiks CLI.`
      );

      console.log(chalk.yellow("📖 Added README.md"));
    });

  return command;
}
