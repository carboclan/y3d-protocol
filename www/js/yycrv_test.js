$(function () {
  consoleInit();
  start(main);
});

async function main() {
  print_warning();

  const stakingTokenAddr = YCRV_TEST_ADDR;
  const yyCrvTokenAddr = YYCRV_TEST_ADDR;
  const stakingTokenTicker = "yCrv";
  const rewardPoolAddr = YYCRV_TEST_ADDR;
  const rewardTokenAddr = YYCRV_TEST_ADDR;
  const rewardTokenTicker = "yyCrv";

  const App = await init_ethers();

  _print(`Initialized ${App.YOUR_ADDRESS}`);
  _print("Reading smart contracts...\n");
  _print(`${rewardTokenTicker} Address: ${rewardTokenAddr}`);
  _print(`Reward Pool Address: ${rewardPoolAddr}\n`);

  const yCRV_TOKEN = new ethers.Contract(stakingTokenAddr, YCRV_ABI, App.provider);
  const yCRVBalance = await yCRV_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;

  const invest_yCRV = async function (amount) {
    return yyCrvContract_invest(yyCrvTokenAddr, amount, App);
  };

  const redeem = async function (amount) {
    return yyCrvContract_redeem(yyCrvTokenAddr, amount, App);
  };

  const depositAll = async function () {
    return yyCrvContract_deposit_all(yyCrvTokenAddr, App);
  };

  const deposit = async function () {
    return yyCrvContract_deposit(yyCrvTokenAddr, App);
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

  _print_button_input(`Invest ${stakingTokenTicker}`, yCRVBalance, invest_yCRV);
  _print_button_input(`Redeem Shares`, 0, redeem);
  _print_button_input(`Withdraw ${rewardTokenTicker}`, 0, withdraw);
  _print_button(`Deposit All`, depositAll);
  _print_button(`Deposit`, deposit);
  _print_button(`Harvest To Consul`, harvestToConsul);
  _print_button(`Harvest To Uniswap`, harvestToUniswap);

  hideLoading();
}
