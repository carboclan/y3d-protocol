$(function() {
    consoleInit();
    start(main);
});

async function main() {

    const stakingToken = WETH_TOKEN_ADDR;
    const stakingTokenTicker = "yCrv";
    const rewardPoolAddr = WETH_REWARD_ADDR;
    const rewardTokenAddr = PASTA_TOKEN_ADDR;
    const rewardTokenTicker = "Y3D";
    const miningTokenAddr = "0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1";

    const App = await initEthers();

    _print(`Initialized ${App.YOUR_ADDRESS}`);
    _print("Reading smart contracts...\n");
    printWarning();

    const P_STAKING_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, App.provider);
    const Y_TOKEN = new ethers.Contract(stakingToken, ERC20_ABI, App.provider);
    const Mining_TOKEN = new ethers.Contract(miningTokenAddr, ERC20_ABI, App.provider);


    const stakedYAmount = await P_STAKING_POOL.balanceOf(App.YOUR_ADDRESS) / 1e18;
    const earnedYFFI = await P_STAKING_POOL.earned(App.YOUR_ADDRESS) / 1e18;
    const earnedLP = await P_STAKING_POOL.unrealizedProfit(App.YOUR_ADDRESS) / 1e18;

    const miningAmount = await Mining_TOKEN.balanceOf(rewardPoolAddr) / 1e18;

    const totalSupplyY = await Y_TOKEN.totalSupply() / 1e18;
    const totalTotalYAmount = await Y_TOKEN.balanceOf(rewardPoolAddr) / 1e18 + miningAmount;


    const totalStakedYAmount = await P_STAKING_POOL.totalSupply() / 1e18;

    // Find out reward rate
    const weekly_reward = await getSynthWeeklyRewards(P_STAKING_POOL) / 1e18;
    const nextHalving = await getPeriodFinishForReward(P_STAKING_POOL);

    const rewardPerToken = weekly_reward / totalStakedYAmount;

    // Find out underlying assets of Y
    const unstakedY = await Y_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;

    // Find out underlying assets of Y
    const crv_miningY = await Y_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;

    const prices = await lookUpPrices(["ethereum", "spaghetti"]);
    const stakingTokenPrice = prices["ethereum"].usd;
    const rewardTokenPrice = prices["spaghetti"].usd;

   _print(`\n======== ♨️ Mining Pool 1 ========`);
   _print(`Pool              : <a href="https://etherscan.io/address/${rewardPoolAddr}">${rewardPoolAddr}</a> | <a href="https://www.diffchecker.com/thQp6Mak">Diff</a>`);
   _print(`Input             : <a href="https://etherscan.io/address/0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8#code">${stakingTokenTicker}</a>`);
   _print(`Output            : <a href="https://etherscan.io/address/${rewardTokenAddr}#code">♨️</a>`);
//   _print(`There are total   : ${totalSupplyY} ${stakingTokenTicker}.`);
   _print(`There are total   : ${totalStakedYAmount} ${stakingTokenTicker} staked in ${rewardTokenTicker}'s ${stakingTokenTicker} staking pool.`);
   _print(`There are total   : ${miningAmount} in staking pool which minning CRV in <a href="https://etherscan.io/address/0xfa712ee4788c042e2b7bb55e6cb8ec569c4530c1#tokentxns">yCrv Gauge</a>.`);
   _print(`There are total   : ${totalTotalYAmount - totalStakedYAmount} ${stakingTokenTicker} in profit pool which ready to claim.`);
   _print(`You are staking   : ${stakedYAmount} ${stakingTokenTicker} (${toFixed(stakedYAmount * 100 / totalStakedYAmount, 3)}% of the pool)`);
/*
   _print(`Claimable Rewards : ${toFixed(earnedYFFI, 4)} ${rewardTokenTicker} = $${toFixed(earnedYFFI * rewardTokenPrice, 2)}`);
   const YFFIWeeklyEstimate = rewardPerToken * stakedYAmount;
   _print(`Hourly estimate   : ${toFixed(YFFIWeeklyEstimate / (24 * 7), 4)} ${rewardTokenTicker} = ${toDollar((YFFIWeeklyEstimate / (24 * 7)) * rewardTokenPrice)} (out of total ${toFixed(weekly_reward / (7 * 24), 2)} ${rewardTokenTicker})`)
   _print(`Daily estimate    : ${toFixed(YFFIWeeklyEstimate / 7, 2)} ${rewardTokenTicker} = ${toDollar((YFFIWeeklyEstimate / 7) * rewardTokenPrice)} (out of total ${toFixed(weekly_reward / 7, 2)} ${rewardTokenTicker})`)
   _print(`Weekly estimate   : ${toFixed(YFFIWeeklyEstimate, 2)} ${rewardTokenTicker} = ${toDollar(YFFIWeeklyEstimate * rewardTokenPrice)} (out of total ${weekly_reward} ${rewardTokenTicker})`)*/
   _print(`Mining start      : at <a href="https://twitter.com/Y3dScam/status/1297933387202613251">Tuesday, August 25, 2020 at 07:00:00 PDT</a>`);
   _print(`P3D ratio         : 5%`);  
   const YFIWeeklyROI = (rewardPerToken * rewardTokenPrice) * 100 / (stakingTokenPrice);

 /*  _print(`\nHourly ROI in USD : ${toFixed((YFIWeeklyROI / 7) / 24, 4)}%`)
   _print(`Daily ROI in USD  : ${toFixed(YFIWeeklyROI / 7, 4)}%`)
   _print(`Weekly ROI in USD : ${toFixed(YFIWeeklyROI, 4)}%`)
   _print(`APY (unstable)    : ${toFixed(YFIWeeklyROI * 52, 4)}% \n`)*/

    const timeTilHalving = nextHalving - (Date.now() / 1000);

    /*
    if (timeTilHalving > 604800) {
        _print(`Reward starting   : in ${forHumans(timeTilHalving - 604800)} \n`);
    } else {
        _print(`Reward ending     : in ${forHumans(timeTilHalving)} \n`);
    }*/

    const approveTENDAndStake = async function () {
        return yCrvContract_stake(stakingToken, rewardPoolAddr, App);
    };

    const unstake = async function() {
        return yCrvContract_unstake(rewardPoolAddr, App);
    };

    const claim = async function() {
        return yCrvContract_claim(rewardPoolAddr, App);
    };

    const claim_LP = async function() {
        return yCrvContract_claim_LP(rewardPoolAddr, App);
    };

    const exit = async function() {
        return yCrvContract_exit(rewardPoolAddr, App);
    };

    const harvest = async function() {
        return yCrvContract_harvest(rewardPoolAddr, App);
    };

    const approveTENDAndStakeWithValue = async function (amt) {
        return yCrvContract_stake_amount(amt, stakingToken, rewardPoolAddr, App);
    };

    const unstakeWithValue = async function(amt) {
        return yCrvContract_unstake_amount(amt, rewardPoolAddr, App);
    };

    _print('\n');
    _print('\n');
    _print(`============== Basic Panel ==============`);
    _print_button(`Stake ${unstakedY} ${stakingTokenTicker}`, approveTENDAndStake);
    _print_button(`Unstake ${stakedYAmount} ${stakingTokenTicker}`, unstake);
    _print_button(`Claim ${earnedYFFI} ${rewardTokenTicker}`, claim);
    _print_button(`Claim ${earnedLP} ${stakingTokenTicker}`, claim_LP);
    _print('\n');
    _print(`============== High Level Panel ==============`);
    _print_button_input_pure(`Stake ${stakingTokenTicker}`, unstakedY, approveTENDAndStakeWithValue);
    _print_button_input_pure(`Unstake ${stakingTokenTicker}`, stakedYAmount, unstakeWithValue);
    _print_button(`Exit(Unstake && Claim All)`, exit);
    //_print_button(`Harvest`, harvest);

    hideLoading();
}
