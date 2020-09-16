$(function() {
    consoleInit();
    start(main);
});

async function main() {
    const App = await initEthers();
    const unitedMintAddr = UNITED_MINT_ADDR;
    const unitedMintAddr2 = "0x38d1D1d6F136c4D3D696E4d72748853Be2D5751B";    

    const UNI_DEPOSIT_CONTRACT = new ethers.Contract(unitedMintAddr, UNITED_MINT_ABI, App.provider);
    const UNI_DEPOSIT_CONTRACT2 = new ethers.Contract(unitedMintAddr2, UNITED_MINT_ABI2, App.provider);
       
    const depositUsdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const deposit_yyCrv = await UNI_DEPOSIT_CONTRACT.yyCrv();
    const depositUsdt2 = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const deposit_yswUSD = "0x2b1120F0C8238C098C767282092D49d9ac527e8C";
    
    const USDT_TOKEN = new ethers.Contract(depositUsdt, ERC20_ABI, App.provider);
    const yyCrv_TOKEN = new ethers.Contract(deposit_yyCrv, YYCRV_ABI, App.provider);

    const yswUSD_TOKEN = new ethers.Contract(deposit_yswUSD, YYCRV_ABI, App.provider);    

    const [ mintedUsdt, unmintedUsdt, minted_yyCRV] = await Promise.all([
        UNI_DEPOSIT_CONTRACT.mintedUSDT(),
        UNI_DEPOSIT_CONTRACT.unminted_USDT(),
        UNI_DEPOSIT_CONTRACT.minted_yyCRV()
    ]);
    const [ mintedUsdt2, unmintedUsdt2, minted_yyCRV2] = await Promise.all([
        UNI_DEPOSIT_CONTRACT2.mintedUSDT(),
        UNI_DEPOSIT_CONTRACT2.unminted_USDT(),
        UNI_DEPOSIT_CONTRACT2.minted_yswUSD()
    ]);

    const [ usdtBalance, yyCrvBalance, depositUsdtBalance ] = await Promise.all([
        USDT_TOKEN.balanceOf(App.YOUR_ADDRESS),
        yyCrv_TOKEN.balanceOf(App.YOUR_ADDRESS),
        UNI_DEPOSIT_CONTRACT.balanceOf(App.YOUR_ADDRESS)
    ]);

    const [ usdtBalance2, yyCrvBalance2, depositUsdtBalance2 ] = await Promise.all([
        USDT_TOKEN.balanceOf(App.YOUR_ADDRESS),
        yswUSD_TOKEN.balanceOf(App.YOUR_ADDRESS),
        UNI_DEPOSIT_CONTRACT2.balanceOf(App.YOUR_ADDRESS)
    ]);

    const approveUsdtAndDeposit = async function () {
        return uniDepositContract_deposit(depositUsdt, unitedMintAddr, App);
    }

    const approveUsdtDepositAndClaim = async function (amount) {
        return uniDepositContract_deposit_n_claim(amount, depositUsdt, unitedMintAddr, App);
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

    const restoreWithAmount = async function (amount) {
        return uniDepositContract_restore_amount(amount, unitedMintAddr, deposit_yyCrv, App);
    }
    
    const formatUsdt = (val) => ethers.utils.formatUnits(val, 6).toString();
    const formatYyCrv = (val) => ethers.utils.formatUnits(val, 18).toString();


    const approveUsdtAndDeposit2 = async function () {
        return uniDepositContract_deposit(depositUsdt2, unitedMintAddr2, App);
    }

    const approveUsdtDepositAndClaim2 = async function (amount) {
        return uniDepositContract_deposit_n_claim(amount, depositUsdt2, unitedMintAddr2, App);
    }

    const approveUsdtAndDepositWithAmount2 = async function (amount) {
        return uniDepositContract_deposit_amount(amount, depositUsdt2, unitedMintAddr2, App);
    }

    const mint_yyCRV2 = async function () {
        return uniDepositContract_mint(unitedMintAddr2, App);
    }

    const claimMy_yyCrv2 = async function () {
        return uniDepositContract_claim2(unitedMintAddr2, App);
    }

    const restoreWithAmount2 = async function (amount) {
        return uniDepositContract_restore_amount(amount, unitedMintAddr2, deposit_yswUSD, App);
    }
    


    _print("======== Unimint - yyCrv ========");
    _print("TL;DR: Crowdfunding <a href=\"https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7\">USDT</a> to print <a href=\"/y3d/yycrv\">yyCrv</a>");
    _print('\n');
    _print("  ======== Dashboard ==========")
    _print(`United Mint Contract: <a href="https://etherscan.io/address/${unitedMintAddr}">${unitedMintAddr} </a>`);
    _print(`Total minted yyCrv: ${formatYyCrv(minted_yyCRV)}`);
    _print(`Total minted USDT: ${formatUsdt(mintedUsdt)}`);
    _print(`Unminted USDT: ${formatUsdt(unmintedUsdt)}`);
    _print(`Your deposited USDT: ${formatUsdt(depositUsdtBalance)}`);
    _print(`Your current USDT balance(undeposited):  ${formatUsdt(usdtBalance)}`);
    _print(`Your current yyCrv balance:  ${formatYyCrv(yyCrvBalance)}`);
    _print('\n');
    _print(`  ============ Basic Panel ==============`);
    _print_button(`Deposit USDT (ALL)`, approveUsdtAndDeposit);    
    _print_button_input_pure(`Deposit USDT`, formatUsdt(usdtBalance), approveUsdtAndDepositWithAmount);
    _print_button(`Mint`, mint_yyCRV);
    _print_button(`Claim`, claimMy_yyCrv);
    _print_button_input_pure(`Deposit, Mint & Claim`, formatUsdt(usdtBalance), approveUsdtDepositAndClaim);
    _print('\n');
    _print(`  ============ High Level Panel ==============`);
//    _print_button(`Restore`, restore);
    _print_button_input_pure(`Restore yyCrv`, formatYyCrv(yyCrvBalance), restoreWithAmount);


    _print('\n');
    _print('\n');
    _print(`<img src="../../img/curve_replacement.jpg" width="25%" alt="mint"></img>`);

    _print("======== Unimint - yswUSD ========");
    _print("TL;DR: Crowdfunding <a href=\"https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7\">USDT</a> to print <a href=\"/y3d/yswusd\">yswUSD</a>");
    _print('\n');
    _print("  ======== Dashboard ==========")
    _print(`United Mint Contract: <a href="https://etherscan.io/address/${unitedMintAddr2}">${unitedMintAddr2} </a>`);
    _print(`Total minted yswUSD: ${formatYyCrv(minted_yyCRV2)}`);
    _print(`Total minted USDT: ${formatUsdt(mintedUsdt2)}`);
    _print(`Unminted USDT: ${formatUsdt(unmintedUsdt2)}`);
    _print(`Your deposited USDT: ${formatUsdt(depositUsdtBalance2)}`);
    _print(`Your current USDT balance(undeposited):  ${formatUsdt(usdtBalance2)}`);
    _print(`Your current yswUSD balance:  ${formatYyCrv(yyCrvBalance2)}`);
    _print('\n');
    _print(`  ============ Basic Panel ==============`);
    _print_button(`Deposit USDT (ALL)`, approveUsdtAndDeposit2);    
    _print_button_input_pure(`Deposit USDT`, formatUsdt(usdtBalance2), approveUsdtAndDepositWithAmount2);
    _print_button(`Mint`, mint_yyCRV2);
    _print_button(`Claim`, claimMy_yyCrv2);
    _print_button_input_pure(`Deposit, Mint & Claim`, formatUsdt(usdtBalance2), approveUsdtDepositAndClaim2);
    _print('\n');
    _print(`  ============ High Level Panel ==============`);
//    _print_button(`Restore`, restore);
    _print_button_input_pure(`Restore yswUSD`, formatYyCrv(yyCrvBalance2), restoreWithAmount2);


/*    _print('\n');
    _print('\n');
    _print('<a href="https://rinkeby.etherscan.io/address/0xb7db2f602ea790b21a5519ffcfc256d7618f2fc2#writeContract" target="_blank">Fake USDT watertap ↗️</a>')
*/
    hideLoading();
}