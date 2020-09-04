$(function() {
    consoleInit();
    start(main);
});

async function main() {
    const App = await init_ethers();

//    _print("============== STAKING ==============")
    /*
//    _print(`There are total   : ${totalSupplyY} ${stakingTokenTicker}.`);
    _print(`There are total   : ${totalStakedYAmount} ${stakingTokenTicker} staked in ${rewardTokenTicker}'s ${stakingTokenTicker} staking pool.`);
    _print(`There are total   : ${miningAmount} in staking pool which minning CRV in <a href="https://etherscan.io/address/0xfa712ee4788c042e2b7bb55e6cb8ec569c4530c1#tokentxns">yCrv Gauge</a>.`);
    _print(`There are total   : ${totalTotalYAmount - totalStakedYAmount} ${stakingTokenTicker} in profit pool which ready to claim.`);
    _print(`You are staking   : ${stakedYAmount} ${stakingTokenTicker} (${toFixed(stakedYAmount * 100 / totalStakedYAmount, 3)}% of the pool)`);*/
    const UNI_DEPOSIT_CONTRACT = new ethers.Contract(uniDepositAddr, UNI_DEPOSIT_ABI, App.provider);
    const depositUsdt = await UNI_DEPOSIT_CONTRACT.USDT();
    const deposit_yCrv = await UNI_DEPOSIT_CONTRACT.yCrvToken();
    const USDT_TOKEN = new ethers.Contract(depositUsdt, ERC20_ABI, App.provider);
    const yCrv_TOKEN = new ethers.Contract(deposit_yCrv, ERC20_ABI, App.provider);

    const [ mintedUsdt, unmintedUsdt, minted_yCRV] = await Promise.all([
        UNI_DEPOSIT_CONTRACT.mintedUSDT(),
        UNI_DEPOSIT_CONTRACT.unminted_USDT(),
        UNI_DEPOSIT_CONTRACT.minted_yCRV()
    ])
    const [ usdtBalance, yCrvBalance, depositUsdtBalance ] = await Promise.all([
        USDT_TOKEN.balanceOf(App.YOUR_ADDRESS),
        yCrv_TOKEN.balanceOf(App.YOUR_ADDRESS),
        UNI_DEPOSIT_CONTRACT.balanceOf(App.YOUR_ADDRESS)
    ])

    _print("========== Dashboard ==========")
    _print(`Total minted yyCrv: ${minted_yCRV / 1e18}`);    
    _print(`Total minted USDT: ${mintedUsdt / 1e6}`);
    _print(`Unminted USDT: ${unmintedUsdt / 1e6}`);
    _print(`Your deposited USDT: ${depositUsdtBalance / 1e6}`);
    _print(`Your current USDT balance (undeposited):  ${usdtBalance / 1e6}`);
    _print(`Your current yyCrv balance:  ${yCrvBalance / 1e18}`);

    const approveUsdtAndDeposit = async function () {
        return uniDepositContract_deposit(depositUsdt, uniDepositAddr, App);
    }

    const mint_yCRV = async function () {
        return uniDepositContract_mint(uniDepositAddr, App);
    }

    const claimMy_yCrv = async function () {
        return uniDepositContract_claim(uniDepositAddr, App);
    }

    const withdraw = async function () {
        return uniDepositContract_withdraw(uniDepositAddr, deposit_yCrv, App);
    }
    
    _print('\n');
    _print('\n');
    _print(`============== Basic Panel ==============`);
    _print_button(`Deposit USDT (ALL)`, approveUsdtAndDeposit);
    _print_button(`Claim`, claimMy_yCrv);
    _print_button(`Mint`, mint_yCRV);
    // _print_button(`Claim ${earnedYFFI} ${rewardTokenTicker}`, claim);
    // _print_button(`Claim ${earnedLP} ${stakingTokenTicker}`, claim_LP);
    _print('\n');
    _print(`============== High Level Panel ==============`);
    _print_button(`Withdraw`, withdraw);    
  //  _print_button_input(`Stake ${stakingTokenTicker}`, unstakedAmount, approveTENDAndStakeWithValue);
//    _print_button_input(`Unstake ${stakingTokenTicker}`, stakedAmount, unstakeWithValue);

    hideLoading();
}