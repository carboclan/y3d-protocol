$(function() {
    consoleInit();
    start(main);
});

async function main() {
    const App = await initEthers();
    const unitedMintAddr = UNITED_MINT_ADDR;

    const UNI_DEPOSIT_CONTRACT = new ethers.Contract(unitedMintAddr, UNITED_MINT_ABI, App.provider);
    const depositUsdt = await UNI_DEPOSIT_CONTRACT.USDT();
    // const deposit_yCrv = await UNI_DEPOSIT_CONTRACT.yCrv();
    const deposit_yyCrv = await UNI_DEPOSIT_CONTRACT.yyCrv();
    const USDT_TOKEN = new ethers.Contract(depositUsdt, ERC20_ABI, App.provider);
    // const yCrv_TOKEN = new ethers.Contract(deposit_yCrv, ERC20_ABI, App.provider);
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

    const approveUsdtDepositAndClaim = async function () {
        return uniDepositContract_deposit_n_claim(depositUsdt, unitedMintAddr, App);
    }

    const approveUsdtAndDepositWithAmount = async function (amount) {
        return uniDepositContract_deposit_amount(amount, depositUsdt, unitedMintAddr, App);
    }

    const mint_yyCRV = async function () {
        return uniDepositContract_mint(unitedMintAddr, App);
    }

    const claimMy_yyCrv = async function () {
        return uniDepositContract_claim(unitedMintAddr, App);
    }

    const withdraw = async function () {
        return uniDepositContract_restore(unitedMintAddr, deposit_yyCrv, App);
    }

    const withdrawWithAmount = async function (amount) {
        return uniDepositContract_restore_amount(amount, unitedMintAddr, deposit_yyCrv, App);
    }
    
    _print("========== Dashboard ==========")
    _print(`Total minted yyCrv: ${minted_yyCRV / 1e18}`);
    _print(`Total minted USDT: ${mintedUsdt / 1e6}`);
    _print(`Unminted USDT: ${unmintedUsdt / 1e6}`);
    _print(`Your deposited USDT: ${depositUsdtBalance / 1e6}`);
    _print(`Your current USDT balance (undeposited):  ${usdtBalance / 1e6}`);
    _print(`Your current yyCrv balance:  ${yyCrvBalance / 1e18}`);
    _print('\n');
    _print(`============== Basic Panel ==============`);
    _print_button_input(`Deposit USDT`, usdtBalance, approveUsdtAndDepositWithAmount);
    _print_button(`Deposit USDT (ALL)`, approveUsdtAndDeposit);
    _print_button(`Deposit, Mint & Claim (ALL)`, approveUsdtDepositAndClaim);
    _print_button(`Claim`, claimMy_yyCrv);
    _print_button(`Mint`, mint_yyCRV);
    _print('\n');
    _print(`============== High Level Panel ==============`);
    _print_button(`Restore`, withdraw);
    _print_button_input(`Restore`, yyCrvBalance, withdrawWithAmount);
    _print('\n');
    _print('\n');
    _print('<a href="https://rinkeby.etherscan.io/address/0xb7db2f602ea790b21a5519ffcfc256d7618f2fc2#writeContract" target="_blank">Fake USDT watertap ↗️</a>')

    hideLoading();
}