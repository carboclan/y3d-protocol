$(function() {
    consoleInit();
    start(main);
});

async function main() {

    const stakingTokenAddr = PASTA_YYCRV_UNI_TOKEN_ADDR;
    const stakingTokenTicker = "UNIV2";
    const rewardPoolAddr = PASTA_YYCRV_REWARD_ADDR;
    const rewardTokenAddr = PASTA_TOKEN_ADDR;
    const rewardTokenTicker = "PASTA";

    const App = await init_ethers();

    _print(`Initialized ${App.YOUR_ADDRESS}`);
    _print("Reading smart contracts...\n");
    _print(`${rewardTokenTicker} Address: ${rewardTokenAddr}`);
    _print(`Reward Pool Address: ${rewardPoolAddr}\n`);

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, App.provider);
    const STAKING_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, App.provider);

    const stakedYAmount = await REWARD_POOL.balanceOf(App.YOUR_ADDRESS) / 1e18;
    const earnedYFFI = await REWARD_POOL.earned(App.YOUR_ADDRESS) / 1e18;
    
    const totalSupplyOfStakingToken = await STAKING_TOKEN.totalSupply() / 1e18;
    const totalStakedYAmount = await STAKING_TOKEN.balanceOf(rewardPoolAddr) / 1e18;

    // Find out reward rate
    const weekly_reward = await get_synth_weekly_rewards(REWARD_POOL) / 1e18;
    const nextHalving = await getPeriodFinishForReward(REWARD_POOL);

    const rewardPerToken = weekly_reward / totalStakedYAmount;

    // Find out underlying assets of Y
    const unstakedY = await STAKING_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;

   _print("============== STAKING ==============")
   _print(`There are total   : ${totalSupplyOfStakingToken} ${stakingTokenTicker}.`);
   _print(`There are total   : ${totalStakedYAmount} ${stakingTokenTicker} staked in ${rewardTokenTicker}'s ${stakingTokenTicker} staking pool.`);
   _print(`You are staking   : ${stakedYAmount} ${stakingTokenTicker} (${toFixed(stakedYAmount * 100 / totalStakedYAmount, 3)}% of the pool)`);
   _print(`\n======== 🍝 ${rewardTokenTicker} REWARDS 🍝 ========`)
   _print(`Claimable Rewards : ${toFixed(earnedYFFI, 4)} ${rewardTokenTicker}`);
   const YFFIWeeklyEstimate = rewardPerToken * stakedYAmount;
   _print(`Hourly estimate   : ${toFixed(YFFIWeeklyEstimate / (24 * 7), 4)} ${rewardTokenTicker}`)
   _print(`Daily estimate    : ${toFixed(YFFIWeeklyEstimate / 7, 2)} ${rewardTokenTicker}`)
   _print(`Weekly estimate   : ${toFixed(YFFIWeeklyEstimate, 2)} ${rewardTokenTicker}`)

    const timeTilHalving = nextHalving - (Date.now() / 1000);

    if (timeTilHalving > 1814400) {
        _print(`Reward starting   : in ${forHumans(timeTilHalving - 1814400)} \n`);
    } else {
        _print(`Reward ending     : in ${forHumans(timeTilHalving)} \n`);
    }

    const resetApprove = async function() {
       return rewardsContract_resetApprove(stakingTokenAddr, rewardPoolAddr, App);
    };

    const approveTENDAndStake = async function () {
        return wi(stakingTokenAddr, rewardPoolAddr, App);
    };

    const unstake = async function() {
        return rewardsContract_unstake(rewardPoolAddr, App);
    };

    const claim = async function() {
        return rewardsContract_claim(rewardPoolAddr, App);
    };

    const exit = async function() {
        return rewardsContract_exit(rewardPoolAddr, App);
    };

    _print_link(`Reset approval to 0`, resetApprove);
    _print_link(`Stake ${unstakedY} ${stakingTokenTicker}`, approveTENDAndStake);
    _print_link(`Unstake ${stakedYAmount} ${stakingTokenTicker}`, unstake);
    _print_link(`Claim ${earnedYFFI} ${rewardTokenTicker}`, claim);
    _print_link(`Exit`, exit);

    hideLoading();

}
