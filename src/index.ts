#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init.js";

const program = new Command();
program.version("0.0.1").description("Nyiks CLI - Stacks Contract Generator");

program.addCommand(initCommand());

program.parse(process.argv);
