$(function() {
    consoleInit();
    start(main);
});

async function main() {
    const uniSwapPoolAddr = "0xcd4079b9713cdd1e629492b9c07ebd0dbd9f5202";
    const y3DTokenAddr = PASTA_TOKEN_ADDR;
    const y3DTokenTicker = "Y3D";
    const yyCrvTokenAddr = YYCRV_TEST_ADDR;
    const yyCrvTokenTicker = "yyCrv";

    const App = await init_ethers();

    const Y3D_TOKEN = new ethers.Contract(y3DTokenAddr, ERC20_ABI, App.provider);
    const YYCRV_TOKEN = new ethers.Contract(yyCrvTokenAddr, YYCRV_ABI, App.provider);

    const totalY3DPoolAmount = await Y3D_TOKEN.balanceOf(uniSwapPoolAddr) / 1e18;
    const totalYYCRVPoolAmount = await YYCRV_TOKEN.balanceOf(uniSwapPoolAddr) / 1e18;

    const stakingTokenPrice = 1.07;

    _print("========== PRICES ==========")
    _print(`1 ${yyCrvTokenTicker}  = $${stakingTokenPrice}\n`);
    _print("============== STAKING ==============")
    _print(`There are total   : ${totalYYCRVPoolAmount} ${yyCrvTokenTicker}.`);
    _print(`There are total   : ${totalY3DPoolAmount} ${y3DTokenTicker}.`);
    _print(`                  = ${toDollar(totalYYCRVPoolAmount / totalY3DPoolAmount * stakingTokenPrice)}\n`);

    hideLoading();
}