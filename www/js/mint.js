$(function() {
    consoleInit();
    start(main);
});

async function main() {
    const rewardPoolAddr = "0xcd60e6f0f05e7091ba231ccaf20088b43fbfbd8b";

    const inputTokenAddr = "0xcd4079b9713cdd1e629492b9c07ebd0dbd9f5202";
    const stakingTokenAddr = inputTokenAddr;

    const App = await init_ethers();

    _print("========== Dashboard ==========")
    _print(`minted yyCrv: 50`);    
    _print(`minted USDT: 100`);
    _print(`unminted USDT: 2313`);
    _print(`your deposited USDT: 10`);
    _print(`your undeposited USDT: 0`);

//    _print("============== STAKING ==============")
    /*
//    _print(`There are total   : ${totalSupplyY} ${stakingTokenTicker}.`);
    _print(`There are total   : ${totalStakedYAmount} ${stakingTokenTicker} staked in ${rewardTokenTicker}'s ${stakingTokenTicker} staking pool.`);
    _print(`There are total   : ${miningAmount} in staking pool which minning CRV in <a href="https://etherscan.io/address/0xfa712ee4788c042e2b7bb55e6cb8ec569c4530c1#tokentxns">yCrv Gauge</a>.`);
    _print(`There are total   : ${totalTotalYAmount - totalStakedYAmount} ${stakingTokenTicker} in profit pool which ready to claim.`);
    _print(`You are staking   : ${stakedYAmount} ${stakingTokenTicker} (${toFixed(stakedYAmount * 100 / totalStakedYAmount, 3)}% of the pool)`);*/

    const INPUT_TOKEN = new ethers.Contract(inputTokenAddr, ERC20_ABI, App.provider);
    const REWARD_TOKEN = new ethers.Contract(rewardPoolAddr, ERC20_ABI, App.provider);
    const unstakedAmount = await INPUT_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;
    const stakedAmount = await REWARD_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;
    // const earnedYFFI = await REWARD_TOKEN.earned(App.YOUR_ADDRESS) / 1e18;
    // const earnedLP = await REWARD_TOKEN.unrealizedProfit(App.YOUR_ADDRESS) / 1e18;

    const approveTENDAndStake = async function () {
        return rewardsContract_stake(stakingTokenAddr, rewardPoolAddr, App);
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

    const approveTENDAndStakeWithValue = async function (amt) {
        return rewardsContract_stake_amount(amt, stakingTokenAddr, rewardPoolAddr, App);
    };

    const unstakeWithValue = async function(amt) {
        return rewardsContract_unstake_amount(amt, rewardPoolAddr, App);
    };
    
    _print('\n');
    _print('\n');
    _print(`============== Basic Panel ==============`);
    _print_button(`Deposit`, approveTENDAndStake);
    _print_button(`Claim`, approveTENDAndStake);
    _print_button(`Mint`, approveTENDAndStake);    
    // _print_button(`Claim ${earnedYFFI} ${rewardTokenTicker}`, claim);
    // _print_button(`Claim ${earnedLP} ${stakingTokenTicker}`, claim_LP);
    _print('\n');
    _print(`============== High Level Panel ==============`);
    _print_button(`Withdraw`, approveTENDAndStake);    
  //  _print_button_input(`Stake ${stakingTokenTicker}`, unstakedAmount, approveTENDAndStakeWithValue);
//    _print_button_input(`Unstake ${stakingTokenTicker}`, stakedAmount, unstakeWithValue);

    hideLoading();
}