import { readFileSync, writeFileSync } from 'fs';
import { emptyWizard, wizards } from '../wizards/wizards.js';

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
