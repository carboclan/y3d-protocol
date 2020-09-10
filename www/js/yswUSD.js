$(function() {
    consoleInit();
    start(main);
});

async function main() {
    const App = await initEthers();
    const unitedMintAddr = "0x2b1120F0C8238C098C767282092D49d9ac527e8C";

    const UNI_DEPOSIT_CONTRACT = new ethers.Contract(unitedMintAddr, yswUSD_ABI, App.provider);
    const depositUsdt = await UNI_DEPOSIT_CONTRACT.USDT();
    const deposit_yswUSD = await UNI_DEPOSIT_CONTRACT.swUSD();
    const USDT_TOKEN = new ethers.Contract(depositUsdt, ERC20_ABI, App.provider);
    const yswUSD_TOKEN = new ethers.Contract(deposit_yswUSD, yswUSD_ABI, App.provider);

    const [ mintedUsdt, unmintedUsdt, minted_yswUSD] = await Promise.all([
        UNI_DEPOSIT_CONTRACT.mintedUSDT(),
        UNI_DEPOSIT_CONTRACT.unminted_USDT(),
        UNI_DEPOSIT_CONTRACT.minted_swUSD()
    ]);
    const [ usdtBalance, yswUSDBalance, depositUsdtBalance ] = await Promise.all([
        USDT_TOKEN.balanceOf(App.YOUR_ADDRESS),
        yswUSD_TOKEN.balanceOf(App.YOUR_ADDRESS),
        UNI_DEPOSIT_CONTRACT.balanceOf(App.YOUR_ADDRESS)
    ]);

    const approveUsdtAndDeposit = async function () {
        return uniDepositContract_deposit(depositUsdt, unitedMintAddr, App);
    }

    const approveUsdtDepositAndClaim = async function (amount) {
        return uniDepositContract_deposit_n_claim(amount, depositUsdt, unitedMintAddr, App);
    }

    const approveUsdtAndDepositWithAmount = async function (amount) {
//        amount *= 1000000;
//        console.log('usdt:', amount);
//        console.log(typeof(amount));
//console.log(amount);
        return uniDepositContract_deposit_amount(amount, depositUsdt, unitedMintAddr, App);
    }

    const mint_yswUSD = async function () {
        return uniDepositContract_mint(unitedMintAddr, App);
    }

    const claimMy_yswUSD = async function () {
        return uniDepositContract_claim(unitedMintAddr, App);
    }

    /*const restore = async function () {
        return uniDepositContract_restore_amount(Math.min(minted_yswUSD, yswUSDBalance), unitedMintAddr, deposit_yswUSD, App);
    }*/

    const restoreWithAmount = async function (amount) {
        return uniDepositContract_restore_amount(amount, unitedMintAddr, deposit_yswUSD, App);
    }
    
    const formatUsdt = (val) => ethers.utils.formatUnits(val, 6).toString();
    const formatyswUSD = (val) => ethers.utils.formatUnits(val, 18).toString();

    _print("========== Dashboard ==========")
    _print(`United Mint Contract: <a href="https://etherscan.io/address/${unitedMintAddr}">${unitedMintAddr} </a>`);
    _print(`Total minted yswUSD: ${formatyswUSD(minted_yswUSD)}`);
    _print(`Total minted USDT: ${formatUsdt(mintedUsdt)}`);
    _print(`Unminted USDT: ${formatUsdt(unmintedUsdt)}`);
    _print(`Your deposited USDT: ${formatUsdt(depositUsdtBalance)}`);
    _print(`Your current USDT balance(undeposited):  ${formatUsdt(usdtBalance)}`);
    _print(`Your current yswUSD balance:  ${formatyswUSD(yswUSDBalance)}`);
    _print('\n');
    _print(`============== Basic Panel ==============`);
    _print_button(`Deposit USDT (ALL)`, approveUsdtAndDeposit);    
    _print_button_input_pure(`Deposit USDT`, formatUsdt(usdtBalance), approveUsdtAndDepositWithAmount);
    _print_button(`Mint`, mint_yswUSD);
    _print_button(`Claim`, claimMy_yswUSD);
    _print_button_input_pure(`Deposit, Mint & Claim`, formatUsdt(usdtBalance), approveUsdtDepositAndClaim);
    _print('\n');
    _print(`============== High Level Panel ==============`);
//    _print_button(`Restore`, restore);
    _print_button_input_pure(`Restore yswUSD`, formatyswUSD(yswUSDBalance), restoreWithAmount);

/*    _print('\n');
    _print('\n');
    _print('<a href="https://rinkeby.etherscan.io/address/0xb7db2f602ea790b21a5519ffcfc256d7618f2fc2#writeContract" target="_blank">Fake USDT watertap ↗️</a>')
*/
    hideLoading();
}