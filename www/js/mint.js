$(function() {
    consoleInit();
    start(main);
});

async function main() {
    const App = await initEthers();
    const unitedMintAddr = UNITED_MINT_ADDR;

    const UNI_DEPOSIT_CONTRACT = new ethers.Contract(unitedMintAddr, UNITED_MINT_ABI, App.provider);
    const depositUsdt = await UNI_DEPOSIT_CONTRACT.USDT();
    const deposit_yyCrv = await UNI_DEPOSIT_CONTRACT.yyCrv();
    const USDT_TOKEN = new ethers.Contract(depositUsdt, ERC20_ABI, App.provider);
    const yyCrv_TOKEN = new ethers.Contract(deposit_yyCrv, YYCRV_ABI, App.provider);

    const [ mintedUsdt, unmintedUsdt, minted_yyCRV] = await Promise.all([
        UNI_DEPOSIT_CONTRACT.mintedUSDT(),
        UNI_DEPOSIT_CONTRACT.unminted_USDT(),
        UNI_DEPOSIT_CONTRACT.minted_yyCRV()
    ]);
    const [ usdtBalance, yyCrvBalance, depositUsdtBalance ] = await Promise.all([
        USDT_TOKEN.balanceOf(App.YOUR_ADDRESS),
        yyCrv_TOKEN.balanceOf(App.YOUR_ADDRESS),
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

    const mint_yyCRV = async function () {
        return uniDepositContract_mint(unitedMintAddr, App);
    }

    const claimMy_yyCrv = async function () {
        return uniDepositContract_claim(unitedMintAddr, App);
    }

    /*const restore = async function () {
        return uniDepositContract_restore_amount(Math.min(minted_yyCRV, yyCrvBalance), unitedMintAddr, deposit_yyCrv, App);
    }*/

    const restoreWithAmount = async function (amount) {
        return uniDepositContract_restore_amount(amount, unitedMintAddr, deposit_yyCrv, App);
    }
    
    const formatUsdt = (val) => ethers.utils.formatUnits(val, 6).toString();
    const formatYyCrv = (val) => ethers.utils.formatUnits(val, 18).toString();

    _print("========== Dashboard ==========")
    _print(`United Mint Contract: <a href="https://etherscan.io/address/${unitedMintAddr}">${unitedMintAddr} </a>`);
    _print(`Total minted yyCrv: ${formatYyCrv(minted_yyCRV)}`);
    _print(`Total minted USDT: ${formatUsdt(mintedUsdt)}`);
    _print(`Unminted USDT: ${formatUsdt(unmintedUsdt)}`);
    _print(`Your deposited USDT: ${formatUsdt(depositUsdtBalance)}`);
    _print(`Your current USDT balance(undeposited):  ${formatUsdt(usdtBalance)}`);
    _print(`Your current yyCrv balance:  ${formatYyCrv(yyCrvBalance)}`);
    _print('\n');
    _print(`============== Basic Panel ==============`);
    _print_button(`Deposit USDT (ALL)`, approveUsdtAndDeposit);    
    _print_button_input_pure(`Deposit USDT`, formatUsdt(usdtBalance), approveUsdtAndDepositWithAmount);
    _print_button(`Mint`, mint_yyCRV);
    _print_button(`Claim`, claimMy_yyCrv);
    _print_button_input_pure(`Deposit, Mint & Claim`, formatUsdt(usdtBalance), approveUsdtDepositAndClaim);
    _print('\n');
    _print(`============== High Level Panel ==============`);
//    _print_button(`Restore`, restore);
    _print_button_input_pure(`Restore yyCrv`, formatYyCrv(Math.min(minted_yyCRV, yyCrvBalance)), restoreWithAmount);

/*    _print('\n');
    _print('\n');
    _print('<a href="https://rinkeby.etherscan.io/address/0xb7db2f602ea790b21a5519ffcfc256d7618f2fc2#writeContract" target="_blank">Fake USDT watertap ↗️</a>')
*/
    hideLoading();
}