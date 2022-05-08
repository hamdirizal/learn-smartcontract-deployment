const path = require('path');
const fs = require('fs');
const solc = require('solc');
const { cwd } = require('process');
const { COMPILE_DIR, CONTRACT_FILENAME } = require('./app-config');


function compileFile(filename) {
  let solPath = path.join(cwd(), 'contracts', filename);
  if (!fs.existsSync(solPath)) process.exit(1);

  let sources = {}
  sources[filename] = { content: fs.readFileSync(solPath, 'UTF-8') };

  const input = {
    language: 'Solidity',
    sources: sources,
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  const compiled = JSON.parse(solc.compile(JSON.stringify(input)));

  for (let contractName in compiled.contracts[filename]) {
    const item = compiled.contracts[filename][contractName];
    fs.writeFileSync(path.join(cwd(), COMPILE_DIR, filename + '.abi'), JSON.stringify(item.abi));
    fs.writeFileSync(path.join(cwd(), COMPILE_DIR, filename + '.bytecode'), item.evm.bytecode.object);
  }

  console.info('Contract file "' + filename + '" has successfully compiled.');
}


function run() {
  if (!fs.existsSync(path.join(cwd(), COMPILE_DIR))) {
    fs.mkdirSync(path.join(cwd(), COMPILE_DIR));
  }
  compileFile(CONTRACT_FILENAME);
}


run();