$(function() {
    consoleInit();
    start(main);
});

async function main() {
    const uniSwapPoolAddr = "0xcd4079b9713cdd1e629492b9c07ebd0dbd9f5202";
    const y3DTokenAddr = PASTA_TOKEN_ADDR;
    const y3DTokenTicker = "Y3D";
    const rewardPoolAddr = "0xcd60e6f0f05e7091ba231ccaf20088b43fbfbd8b";
    const rewardTokenTicker = "Y3D";
    const yyCrvTokenAddr = YYCRV_TEST_ADDR;
    const yyCrvTokenTicker = "yyCrv";

    const inputTokenAddr = "0xcd4079b9713cdd1e629492b9c07ebd0dbd9f5202";
    const stakingTokenAddr = inputTokenAddr;
    const stakingTokenTicker = "Uniswap Y3D-yyCrv LP";
    const rewardTokenAddr = PASTA_TOKEN_ADDR;

    const App = await initEthers();

    const Y3D_TOKEN = new ethers.Contract(y3DTokenAddr, ERC20_ABI, App.provider);
    const YYCRV_TOKEN = new ethers.Contract(yyCrvTokenAddr, YYCRV_ABI, App.provider);

    const _totalY3DPoolAmount = await Y3D_TOKEN.balanceOf(uniSwapPoolAddr); // BigNumber
    const totalY3DPoolAmount = ethers.utils.formatUnits(_totalY3DPoolAmount, 18); // String
    const _totalYYCRVPoolAmount = await YYCRV_TOKEN.balanceOf(uniSwapPoolAddr); // BigNumber
    const totalYYCRVPoolAmount = ethers.utils.formatUnits(_totalYYCRVPoolAmount, 18); // String
    const stakingTokenPrice = 1.09;

    _print("========== UNISWAP ==========")
    _print(`${totalYYCRVPoolAmount} ${yyCrvTokenTicker}`);
    _print(`${totalY3DPoolAmount} ${y3DTokenTicker}`);
    _print(`1 Y3D♨️ = ${toDollar(Number(totalYYCRVPoolAmount) / Number(totalY3DPoolAmount) * stakingTokenPrice)}`);
    _print(`\n======== ♨️ Mining Pool 2 ========`);
    _print(`Pool              : <a href="https://etherscan.io/address/${rewardPoolAddr}">${rewardPoolAddr}</a> | <a href="https://www.diffchecker.com/thQp6Mak">Diff</a>`);
    _print(`Input             : <a href="https://etherscan.io/address/${inputTokenAddr}#code">Uniswap Y3D-yyCrv LP</a>`);
    _print(`Output            : <a href="https://etherscan.io/address/${rewardTokenAddr}#code">♨️</a>`);
    _print(`Mining start      : at <a href="https://www.timeanddate.com/worldclock/fixedtime.html?msg=Y3D+Liquidity+Mining&iso=20200904T00&p1=224">Friday, September 4, 2020 at 12:00 midnight PDT</a>`);
    _print(`P3D ratio         : 5%`);

    const INPUT_TOKEN = new ethers.Contract(inputTokenAddr, ERC20_ABI, App.provider);
    const REWARD_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, App.provider);

    const _unstakedAmount = await INPUT_TOKEN.balanceOf(App.YOUR_ADDRESS); // BigNumber
    const unstakedAmount = ethers.utils.formatUnits(_unstakedAmount, 18); // String

    const _stakedAmount = await REWARD_TOKEN.balanceOf(App.YOUR_ADDRESS); // BigNumber
    const stakedAmount = ethers.utils.formatUnits(_stakedAmount, 18); // String

    const _earnedYFFI = await REWARD_TOKEN.earned(App.YOUR_ADDRESS); // BigNumber
    const earnedYFFI = ethers.utils.formatUnits(_earnedYFFI, 18); // String

    const _earnedLP = await REWARD_TOKEN.unrealizedProfit(App.YOUR_ADDRESS); // BigNumber
    const earnedLP = ethers.utils.formatUnits(_earnedLP, 18); // String

    console.debug("Unstaked:", _unstakedAmount, "\nStaked:", _stakedAmount, "\nEarned:", _earnedYFFI, "\nLP:", _earnedLP);
    console.debug("Unstaked:", unstakedAmount, "\nStaked:", stakedAmount, "\nEarned:", earnedYFFI, "\nLP:", earnedLP);

    const approveTENDAndStake = async function () {
        return uniswapContract_stake(stakingTokenAddr, rewardPoolAddr, App);
    };

    const unstake = async function() {
        return uniswapContract_unstake(rewardPoolAddr, App);
    };

    const claim = async function() {
        return uniswapContract_claim(rewardPoolAddr, App);
    };

    const claimLP = async function() {
        return uniswapContract_claim_LP(rewardPoolAddr, App);
    };

    const approveTENDAndStakeWithValue = async function (amt) {
        return uniswapContract_stake_amount(amt, stakingTokenAddr, rewardPoolAddr, App);
    };

    const unstakeWithValue = async function(amt) {
        return uniswapContract_unstake_amount(amt, rewardPoolAddr, App);
    };

    _print('\n');
    _print('\n');
    _print(`============== Basic Panel ==============`);
    _print_button(`Stake ${unstakedAmount} ${stakingTokenTicker}`, approveTENDAndStake);
    _print_button(`Unstake ${stakedAmount} ${stakingTokenTicker}`, unstake);
    _print_button(`Claim ${earnedYFFI} ${rewardTokenTicker}`, claim);
    _print_button(`Claim ${earnedLP} LP`, claimLP);
    _print('\n');
    _print(`============== High Level Panel ==============`);
    _print_button_input_pure(`Stake ${stakingTokenTicker}`, unstakedAmount, approveTENDAndStakeWithValue);
    _print_button_input_pure(`Unstake ${stakingTokenTicker}`, stakedAmount, unstakeWithValue);

    hideLoading();
}