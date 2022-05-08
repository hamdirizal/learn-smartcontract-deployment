const Web3 = require('web3');
const path = require('path');
const fs = require('fs');
const { cwd } = require('process');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { COMPILE_DIR, CONTRACT_FILENAME, TESTNET_ACCOUNT_ADDRESS, TESTNET_RPC_URL, TESTNET_ACCOUNT_PRIVATEKEY } = require('./app-config');

async function run() {
  const abiFilePath = path.join(cwd(), COMPILE_DIR, CONTRACT_FILENAME + '.abi');
  const bytecodeFilePath = path.join(cwd(), COMPILE_DIR, CONTRACT_FILENAME + '.bytecode');

  //Exit if file not found
  if (!fs.existsSync(abiFilePath) || !fs.existsSync(bytecodeFilePath)) process.exit(1);

  let web3 = new Web3(new HDWalletProvider({ privateKeys: [TESTNET_ACCOUNT_PRIVATEKEY], providerOrUrl: TESTNET_RPC_URL }));

  const [account] = await web3.eth.getAccounts();
  console.log(account)

  //Send Smart Contract To Blockchain
  const abi = fs.readFileSync(abiFilePath, 'UTF-8');
  const bytecode = fs.readFileSync(bytecodeFilePath, 'UTF-8');
  const { _address } = await new web3.eth.Contract(JSON.parse(abi)).deploy({ data: bytecode }).send({ from: account, gas: 1000000 });
  console.log("Contract Address =>", _address);

  process.exit(0);
}
run();