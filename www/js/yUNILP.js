$(function () {
  consoleInit();
  start(main);
});

async function main() {

  printWarning();

  const yCrvTokenAddr = "0x77C6E4a580c0dCE4E5c7a17d0bc077188a83A059";
  const yyCrvTokenAddr = "0x2b1120F0C8238C098C767282092D49d9ac527e8C";
  const stakingTokenTicker = "swUSD";

  const rewardPoolAddr = yyCrvTokenAddr;
  const rewardTokenAddr = yyCrvTokenAddr;
  const rewardTokenTicker = "yswUSD";

  const App = await initEthers();

  _print(`Initialized ${App.YOUR_ADDRESS}`);
  _print("Reading smart contracts...\n");
  _print(`swUSD Address: <a href="https://etherscan.io/address/${yCrvTokenAddr}#code">${yCrvTokenAddr}</a>`);
  _print(`yswUSD Address: <a href="https://etherscan.io/address/${yyCrvTokenAddr}#code">${yyCrvTokenAddr}</a> | <a href="https://www.diffchecker.com/5rWn2D7L">Diff</a>\n`);

  const yCRV_TOKEN = new ethers.Contract(yCrvTokenAddr, YCRV_ABI, App.provider);
  const yyCRV_TOKEN = new ethers.Contract(yyCrvTokenAddr, YYCRV_ABI, App.provider);
  const yCRVBalance = await yCRV_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;
  const yyCRVBalance = await yyCRV_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;
  const withdrawFeeRatio = await yyCRV_TOKEN.fee(App.YOUR_ADDRESS) / 10;
  const yyCrvTotalSupply = await yyCRV_TOKEN.totalSupply() / 1e18;
  const yyCrvPool = await yyCRV_TOKEN.pool() / 1e18;
  const maxMiningRatio = 0;//await yyCRV_TOKEN.maximum_mining_ratio();
  const minMiningRatio = 0; //await yyCRV_TOKEN.minimum_mining_ratio();

  const Mining_TOKEN = new ethers.Contract("0xb4d0C929cD3A1FbDc6d57E7D3315cF0C4d6B4bFa", ERC20_ABI, App.provider);
  const miningAmount = await Mining_TOKEN.balanceOf(yyCrvTokenAddr) / 1e18;

  const yyCrvTotal = miningAmount + await yCRV_TOKEN.balanceOf(yyCrvTokenAddr) / 1e18;
  const curMiningRatio = (miningAmount/yyCrvTotal*100).toFixed(2);


  const stake = async function (amount) {
    return yyCrvContract_stake(yyCrvTokenAddr, yCrvTokenAddr, App.YOUR_ADDRESS, amount, App);
  };

  const unstake = async function (amount) {
    return yyCrvContract_unstake(yyCrvTokenAddr, App.YOUR_ADDRESS, amount, App);
  };

  const make_profit = async function (amount) {
    return yyCrvContract_make_profit(yyCrvTokenAddr, amount, App);
  };

  const depositAll = async function () {
    return yyCrvContract_deposit_all(yyCrvTokenAddr, App);
  };

  const deposit = async function () {
    return yyCrvContract_deposit(yyCrvTokenAddr, App);
  };

  const allIn = async function () {
    return yyCrvContract_allIn(yyCrvTokenAddr, App);
  };

  const rebalance = async function () {
    return yyCrvContract_rebalance(yyCrvTokenAddr, App);
  };

  const withdraw = async function (amount) {
    return yyCrvContract_withdraw(yyCrvTokenAddr, amount, App);
  };

  const harvestToConsul = async function () {
    return yyCrvContract_harvest_to_consul(yyCrvTokenAddr, App);
  };

  const harvestToUniswap = async function () {
    return yyCrvContract_harvest_to_uniswap(yyCrvTokenAddr, App);
  };

  _print(`Total swUSD staked: ${yyCrvPool}`);
  _print(`Total yswUSD supply: ${yyCrvTotalSupply}`);
  _print(`yswUSD price: ${Math.round(yyCrvPool/yyCrvTotalSupply*1.05*1000)/1000}$\n`);
  // _print(`Minimum Mining Ratio: a%`);
  // _print(`Maximum Mining Ratio: b%`);
  // _print(`Current Mining Ratio: c%\n`);
  
  _print(`Mining swUSD  : ${miningAmount}`);
  _print(`Mining ratio : ${miningAmount}/${yyCrvTotal} = ${curMiningRatio}%`);
  _print(`P3D ratio    : 1%`);  
  //_print(`Locked CRV in <a href="https://etherscan.io/address/0x5f3b5dfeb7b28cdbd7faba78963ee202a494e2a2#code">Curve DAO</a>:`);
  //_print(`Boost: x1.0 <a href="https://dao.curve.fi/minter/calc">Calc</a>`);
  _print(`\n`);
/*  _print(`Minimum Mining Ratio: ${minMiningRatio} %`);
  _print(`Maximum Mining Ratio: ${maxMiningRatio} %`);
  _print(`Current Mining Ratio: ${curMiningRatio} %`);*/

  _print(`=== Basic Panel ===`);
//  _print(`Stake yCrv to convert yyCrv; Unstake yyCrv to convert yCrv.\n`);
  _print_button_input_pure(`Stake ${stakingTokenTicker}`, yCRVBalance, stake);
  _print_button_input_pure(`Unstake ${rewardTokenTicker}`, yyCRVBalance, unstake);
  _print(`\n`);

  //  _print(`=== Advanced Panel ===`);
  // _print_button_input(`Donate`, yCRVBalance, make_profit);
  //_print_button_input(`Rebalance`, yCRVBalance, allIn);
  //  _print(`\n\n <a href="https://rinkeby.etherscan.io/address/0xe0f88584bf7e843af50c0bf3d53591566128773f#code">fake yCrv and y3d Faucet ⬅️</a>`);

  /*
  _print_button_input(`Withdraw ${rewardTokenTicker}`, 0, withdraw);
  _print_button(`Deposit All`, depositAll);
  _print_button(`Deposit`, deposit);
  _print_button(`Harvest To Consul`, harvestToConsul);
  _print_button(`Harvest To Uniswap`, harvestToUniswap);
  */
  hideLoading();
}
