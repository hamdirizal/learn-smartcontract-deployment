const Web3 = require('web3');
const path = require('path');
const fs = require('fs');
const { cwd } = require('process');
const { LOCAL_RPC_URL, COMPILE_DIR, CONTRACT_FILENAME, LOCAL_ACCOUNT_ADDRESS } = require('./app-config');

async function run() {
  const abiFilePath = path.join(cwd(), COMPILE_DIR, CONTRACT_FILENAME + '.abi');
  const bytecodeFilePath = path.join(cwd(), COMPILE_DIR, CONTRACT_FILENAME + '.bytecode');

  //Exit if file not found
  if (!fs.existsSync(abiFilePath) || !fs.existsSync(bytecodeFilePath)) process.exit(1);

  const abi = fs.readFileSync(abiFilePath, 'UTF-8');
  const bytecode = fs.readFileSync(bytecodeFilePath, 'UTF-8');


  // let web3 = new Web3(Web3.givenProvider || LOCAL_RPC_URL);
  // await web3.setProvider(new web3.providers.HttpProvider(LOCAL_RPC_URL));
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(LOCAL_RPC_URL));
  web3.eth.defaultAccount = LOCAL_ACCOUNT_ADDRESS;


  //See gas estimate
  let gasEstimate = await web3.eth.estimateGas({ data: '0x' + bytecode });
  console.info('Estimated gas to spend:', gasEstimate)

  //Creating new contract object
  let newContract = new web3.eth.Contract(JSON.parse(abi));

  const payload = {
    data: bytecode
  }

  const parameter = {
    from: LOCAL_ACCOUNT_ADDRESS,
    gas: 800000,
    gasPrice: web3.utils.toWei('30', 'gwei')
  }

  console.info('Deploying the contract');

  newContract.deploy(payload).send(parameter, (err, transactionHash) => {
    console.info('Transaction Hash :', transactionHash);
  }).on('confirmation', (confirmationNumber, receipt) => {
    console.info('Transaction confirmed');
    process.exit(0);
  }).then((newContractInstance) => {
    console.info('Deployed Contract Address : ', newContractInstance.options.address);
  });
}
run();