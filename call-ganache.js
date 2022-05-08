const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const { cwd } = require('process');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { COMPILE_DIR, CONTRACT_FILENAME, LOCAL_RPC_URL, LOCAL_ACCOUNT_ADDRESS } = require('./app-config');

async function run() {

  const contractAddress = '0x0B3eb2Db6417D219478E61731a7f06690590C1C0';
  const abiFilePath = path.join(cwd(), COMPILE_DIR, CONTRACT_FILENAME + '.abi');
  const abi = fs.readFileSync(abiFilePath, 'UTF-8');

  let web3 = new Web3();
  let provider = new web3.providers.HttpProvider(LOCAL_RPC_URL)
  web3.setProvider(provider);
  var contract = new web3.eth.Contract(JSON.parse(abi), contractAddress);
  //Call the retrieve function
  contract.methods.retrieve().call()
    .then(e => {
      console.log(e);
      process.exit(0)
    });

  //Call the store function (updating the state)
  // contract.methods.store(22).send({ from: LOCAL_ACCOUNT_ADDRESS })
  //   .on('receipt', function (e) {
  //     console.log(e)
  //     process.exit(0)
  //   });
}

run();