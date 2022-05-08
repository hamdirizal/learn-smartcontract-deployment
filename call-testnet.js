const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const { cwd } = require('process');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { COMPILE_DIR, CONTRACT_FILENAME, TESTNET_RPC_URL, TESTNET_ACCOUNT_ADDRESS, TESTNET_ACCOUNT_PRIVATEKEY } = require('./app-config');

async function run() {

  const contractAddress = '0x2d43f99d1e9138e70561844b7f7eaad308002cb1';
  const abiFilePath = path.join(cwd(), COMPILE_DIR, CONTRACT_FILENAME + '.abi');
  const abi = fs.readFileSync(abiFilePath, 'UTF-8');

  let provider = new HDWalletProvider({ privateKeys: [TESTNET_ACCOUNT_PRIVATEKEY], providerOrUrl: TESTNET_RPC_URL });
  let web3 = new Web3();
  web3.setProvider(provider);
  var contract = new web3.eth.Contract(JSON.parse(abi), contractAddress);
  //Call the retrieve function
  contract.methods.retrieve().call()
    .then(e => {
      console.log(e);
      process.exit(0)
    });

  //Call the store function (updating the state)
  // contract.methods.store(777).send({ from: TESTNET_ACCOUNT_ADDRESS })
  //   .on('receipt', function (e) {
  //     console.log(e)
  //     process.exit(0)
  //   });
}

run();