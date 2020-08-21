$(function() {
    consoleInit();
    start(main);
});

async function main() {
    print_warning();

    const stakingToken = WETH_TOKEN_ADDR;
    const stakingTokenTicker = "YFII";
    const rewardPoolAddr = WETH_REWARD_ADDR;
    const rewardTokenAddr = PASTA_TOKEN_ADDR;
    const rewardTokenTicker = "Y3D";

    const App = await init_ethers();

    _print(`Initialized ${App.YOUR_ADDRESS}`);
    _print("Reading smart contracts...\n");
    _print(`<a href="https://etherscan.io/address/${rewardTokenAddr}">${rewardTokenTicker} Address: ${rewardTokenAddr}</a>`);
    _print(`<a href="https://etherscan.io/address/${rewardPoolAddr}">Pool Address: ${rewardPoolAddr}</a>\n`);

    const P_STAKING_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, App.provider);
    const Y_TOKEN = new ethers.Contract(stakingToken, ERC20_ABI, App.provider);

    const stakedYAmount = await P_STAKING_POOL.balanceOf(App.YOUR_ADDRESS) / 1e18;
    const earnedYFFI = await P_STAKING_POOL.earned(App.YOUR_ADDRESS) / 1e18;
    const earnedLP = await P_STAKING_POOL.unrealizedProfit(App.YOUR_ADDRESS) / 1e18;    
    const totalSupplyY = await Y_TOKEN.totalSupply() / 1e18;
    const totalStakedYAmount = await Y_TOKEN.balanceOf(rewardPoolAddr) / 1e18;

    // Find out reward rate
    const weekly_reward = await get_synth_weekly_rewards(P_STAKING_POOL) / 1e18;
    const nextHalving = await getPeriodFinishForReward(P_STAKING_POOL);

    const rewardPerToken = weekly_reward / totalStakedYAmount;

    // Find out underlying assets of Y
    const unstakedY = await Y_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;

    const prices = await lookUpPrices(["ethereum", "spaghetti"]);
    const stakingTokenPrice = prices["ethereum"].usd;
    const rewardTokenPrice = prices["spaghetti"].usd;

   _print("============== STAKING ==============")
   _print(`There are total   : ${totalSupplyY} ${stakingTokenTicker}.`);
   _print(`There are total   : ${totalStakedYAmount} ${stakingTokenTicker} staked in ${rewardTokenTicker}'s ${stakingTokenTicker} staking pool.`);
   _print(`                  = ${toDollar(totalStakedYAmount * stakingTokenPrice)}\n`);
   _print(`You are staking   : ${stakedYAmount} ${stakingTokenTicker} (${toFixed(stakedYAmount * 100 / totalStakedYAmount, 3)}% of the pool)`);
   _print(`                  = ${toDollar(stakedYAmount * stakingTokenPrice)}\n`);
   _print(`\n======== ♨️ ${rewardTokenTicker} REWARDS ♨️ ========`)
   _print(`Claimable Rewards : ${toFixed(earnedYFFI, 4)} ${rewardTokenTicker} = $${toFixed(earnedYFFI * rewardTokenPrice, 2)}`);
   const YFFIWeeklyEstimate = rewardPerToken * stakedYAmount;
   _print(`Hourly estimate   : ${toFixed(YFFIWeeklyEstimate / (24 * 7), 4)} ${rewardTokenTicker} = ${toDollar((YFFIWeeklyEstimate / (24 * 7)) * rewardTokenPrice)} (out of total ${toFixed(weekly_reward / (7 * 24), 2)} ${rewardTokenTicker})`)
   _print(`Daily estimate    : ${toFixed(YFFIWeeklyEstimate / 7, 2)} ${rewardTokenTicker} = ${toDollar((YFFIWeeklyEstimate / 7) * rewardTokenPrice)} (out of total ${toFixed(weekly_reward / 7, 2)} ${rewardTokenTicker})`)
   _print(`Weekly estimate   : ${toFixed(YFFIWeeklyEstimate, 2)} ${rewardTokenTicker} = ${toDollar(YFFIWeeklyEstimate * rewardTokenPrice)} (out of total ${weekly_reward} ${rewardTokenTicker})`)
   const YFIWeeklyROI = (rewardPerToken * rewardTokenPrice) * 100 / (stakingTokenPrice);

   _print(`\nHourly ROI in USD : ${toFixed((YFIWeeklyROI / 7) / 24, 4)}%`)
   _print(`Daily ROI in USD  : ${toFixed(YFIWeeklyROI / 7, 4)}%`)
   _print(`Weekly ROI in USD : ${toFixed(YFIWeeklyROI, 4)}%`)
   _print(`APY (unstable)    : ${toFixed(YFIWeeklyROI * 52, 4)}% \n`)

    const timeTilHalving = nextHalving - (Date.now() / 1000);

    /*
    if (timeTilHalving > 604800) {
        _print(`Reward starting   : in ${forHumans(timeTilHalving - 604800)} \n`);
    } else {
        _print(`Reward ending     : in ${forHumans(timeTilHalving)} \n`);
    }*/
    _print(`Mining start   : at Thu Aug 22 2020 21:00:00 GMT-0700 \n`);
    
    const approveTENDAndStake = async function () {
        return rewardsContract_stake(stakingToken, rewardPoolAddr, App);
    };

    const unstake = async function() {
        return rewardsContract_unstake(rewardPoolAddr, App);
    };

    const claim = async function() {
        return rewardsContract_claim(rewardPoolAddr, App);
    };

    const claim_LP = async function() {
        return rewardsContract_claim_LP(rewardPoolAddr, App);
    };    

    const exit = async function() {
        return rewardsContract_exit(rewardPoolAddr, App);
    };

    _print_button(`Stake ${unstakedY} ${stakingTokenTicker}`, approveTENDAndStake);
    _print_button(`Unstake ${stakedYAmount} ${stakingTokenTicker}`, unstake);
    _print_button(`Claim ${earnedYFFI} ${rewardTokenTicker}`, claim);
    _print_button(`Claim ${earnedLP} ${stakingTokenTicker}`, claim_LP);
    _print_button(`Exit`, exit);

    hideLoading();

}
