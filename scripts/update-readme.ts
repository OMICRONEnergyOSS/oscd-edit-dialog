import { readFileSync, writeFileSync } from 'fs';
import { emptyWizard, wizards } from '../wizards/wizards.js';

/*
 * This sadly doesn't work because wizards/wizartds.js references scl-lib which wasn't built to run in Node.js.
 * References to DomParser would need to be replaced with a Node.js compatible library.
 */

const supported = '✅';
const notSupported = '❌';

async function generateSupportTable() {
  let table = '| Tag Name | Supports Create | Supports Edit |\n';
  table += '|-------------|----------------|----------------|\n';

  for (const [key, value] of Object.entries(wizards)) {
    const createSupport =
      value.create === emptyWizard ? notSupported : supported;
    const editSupport = value.edit === emptyWizard ? notSupported : supported;

    table += `| ${key} | ${createSupport} | ${editSupport} |\n`;
  }

  return table;
}

async function main() {
  const template = readFileSync('./README.template.md', 'utf-8');
  const statusTable = await generateSupportTable();

  const output = template.replace('<!-- STATUS_TABLE -->', statusTable);
  writeFileSync('../README.md', output);
  console.log('README.md generated from template.');
}

main().catch(console.error);
