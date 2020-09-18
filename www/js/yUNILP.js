$(function () {
  consoleInit();
  start(main);
});

async function main() {

  printWarning();

  const uNITokenAddr = "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852";
  const yUNITokenAddr = "0x59eC1d5869133a3fBd4421421E48BB94C5644a49";
  const miningTokenAddr = "0x8D7Cd1F7c76393f26aa1fc699206e28501E8a220";
  const stakingTokenTicker = "UNI";
  const rewardTokenTicker = "yUNI";

  const App = await initEthers();

  _print(`Initialized ${App.YOUR_ADDRESS}`);
  _print("Reading smart contracts...\n");
  _print(`${stakingTokenTicker} Address: <a href="https://etherscan.io/address/${uNITokenAddr}#code">${uNITokenAddr}</a>`);
  _print(`${rewardTokenTicker} Address: <a href="https://etherscan.io/address/${yUNITokenAddr}#code">${yUNITokenAddr}</a> | <a href="https://www.diffchecker.com/5rWn2D7L">Diff</a>\n`);

  const UNI_TOKEN = new ethers.Contract(uNITokenAddr, UNI_ABI, App.provider);
  const yUNI_TOKEN = new ethers.Contract(yUNITokenAddr, YUNI_ABI, App.provider);
  const uNIBalance = await UNI_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;
  const yUNIBalance = await yUNI_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;
  console.log('uNIBalance', uNIBalance, 'yUNIBalance', yUNIBalance)
  const withdrawFeeRatio = await yUNI_TOKEN.fee(App.YOUR_ADDRESS) / 10;
  const yUNITotalSupply = await yUNI_TOKEN.totalSupply() / 1e18;
  const yUNIPool = await yUNI_TOKEN.pool() / 1e18;
  const maxMiningRatio = 0; //await yUNI_TOKEN.maximum_mining_ratio();
  const minMiningRatio = 0; //await yUNI_TOKEN.minimum_mining_ratio();

  // const Mining_TOKEN = new ethers.Contract(miningTokenAddr, ERC20_ABI, App.provider);
  // const miningAmount = await Mining_TOKEN.balanceOf(yUNITokenAddr) / 1e18;

  // const yyCrvTotal = miningAmount + await UNI_TOKEN.balanceOf(yUNITokenAddr) / 1e18;
  // const curMiningRatio = (miningAmount/yyCrvTotal*100).toFixed(2);


  const stake = async function (amount) {
    return yUniContract_stake(yUNITokenAddr, uNITokenAddr, App.YOUR_ADDRESS, amount, App);
  };

  const unstake = async function (amount) {
    return yUniContract_unstake(yUNITokenAddr, App.YOUR_ADDRESS, amount, App);
  };

  const make_profit = async function (amount) {
    return yUniContract_make_profit(yUNITokenAddr, uNITokenAddr, amount, App);
  };

  const depositAll = async function () {
    return yUniContract_deposit_all(yUNITokenAddr, App);
  };

  const deposit = async function () {
    return yUniContract_deposit(yUNITokenAddr, App);
  };

  const allIn = async function () {
    return yUniContract_allIn(yUNITokenAddr, App);
  };

  const rebalance = async function () {
    return yUniContract_rebalance(yUNITokenAddr, App);
  };

  const withdraw = async function (amount) {
    return yUniContract_withdraw(yUNITokenAddr, amount, App);
  };

  const harvestToConsul = async function () {
    return yUniContract_harvest_to_consul(yUNITokenAddr, App);
  };

  const harvestToUniswap = async function () {
    return yUniContract_harvest_to_uniswap(yUNITokenAddr, App);
  };

  _print(`Total ${stakingTokenTicker} staked: ${yUNIPool}`);
  _print(`Total ${rewardTokenTicker} supply: ${yUNITotalSupply}`);
  _print(`${rewardTokenTicker} price: ${Math.round(yUNIPool/yUNITotalSupply*1.05*1000)/1000}$\n`);
  
  // _print(`Mining swUSD  : ${miningAmount}`);
  // _print(`Mining ratio : ${miningAmount}/${yyCrvTotal} = ${curMiningRatio}%`);
  _print(`P3D ratio    : 1%`);
  _print(`\n`);

  _print(`=== Basic Panel ===`);
  _print_button_input_pure(`Stake ${stakingTokenTicker}`, uNIBalance, stake);
  _print_button_input_pure(`Unstake ${rewardTokenTicker}`, yUNIBalance, unstake);
  _print(`\n`);
  hideLoading();
}
