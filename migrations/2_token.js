// ============ Contracts ============

const Y3dFactory = artifacts.require("y3dFactory");
//const Y3dFactory = artifacts.require("y3dToken");

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployToken(deployer, network, accounts),
  ]);
};

module.exports = migration;

// ============ Deploy Functions ============
async function deployToken(deployer, network, accounts) {
 // await deployer.deploy(Y3dFactory, accounts[0]);
  await deployer.deploy(Y3dFactory);  
  let y3dFactory = new web3.eth.Contract(Y3dFactory.abi, Y3dFactory.address);  
  console.log('WETH');

  await y3dFactory.methods.initWETH().send({from: accounts[0], gas: 6700000});
//  console.log(y3dFactory.wethpool);
  console.log('UNI');
  await y3dFactory.methods.initUNI().send({from: accounts[0], gas: 6700000});
  //console.log(y3dFactory.uniswapPool);
};