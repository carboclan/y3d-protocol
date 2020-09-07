const yCrvContract_stake = async function(stakingTokenAddr, rewardPoolAddr, App) {

    const signer = App.provider.getSigner();

    const TEND_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, signer);
    const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);

    const currentTEND = await TEND_TOKEN.balanceOf(App.YOUR_ADDRESS);
    const allowedTEND = await TEND_TOKEN.allowance(App.YOUR_ADDRESS, rewardPoolAddr);
    // const currentTENDFormated = ethers.utils.parseUnits(currentTEND, 18);
    // const allowedTENDFormated = ethers.utils.parseUnits(allowedTEND, 18);

    let allow = Promise.resolve();

    if (allowedTEND.lt(currentTEND)) {
        showLoading();
        allow = TEND_TOKEN.approve(rewardPoolAddr, ethers.constants.MaxUint256)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                alert("Try resetting your approval to 0 first");
            });
    }

    if (currentTEND.gt(0)) {
        showLoading();
        allow.then(async function() {
            WEEBTEND_V2_TOKEN.stake(currentTEND).then(function(t) {
                App.provider.waitForTransaction(t.hash).then(function() {
                    hideLoading();
                });
            }).catch(function() {
                hideLoading();
                _print("Something went wrong.");
            });
        }).catch(function () {
            hideLoading();
            _print("Something went wrong.");
        });
    } else {
        alert("You have no tokens to stake!!");
    }
};

const yCrvContract_stake_amount = async function(amount, stakingTokenAddr, rewardPoolAddr, App) {

    const signer = App.provider.getSigner();

    const TEND_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, signer);
    const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);

    const currentTEND = ethers.utils.parseEther(amount);
    const allowedTEND = await TEND_TOKEN.allowance(App.YOUR_ADDRESS, rewardPoolAddr);

    let allow = Promise.resolve();

    if (allowedTEND.lt(currentTEND)) {
        showLoading();
        allow = TEND_TOKEN.approve(rewardPoolAddr, ethers.constants.MaxUint256)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                alert("Try resetting your approval to 0 first");
            });
    }

    if (currentTEND.gt(0)) {
        showLoading();
        allow.then(async function() {
            WEEBTEND_V2_TOKEN.stake(currentTEND).then(function(t) {
                App.provider.waitForTransaction(t.hash).then(function() {
                    hideLoading();
                });
            }).catch(function() {
                hideLoading();
                _print("Something went wrong.");
            });
        }).catch(function () {
            hideLoading();
            _print("Something went wrong.");
        });
    } else {
        alert("You have no tokens to stake!!");
    }
};

const yCrvContract_unstake = async function(rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);
    const currentStakedAmount = await REWARD_POOL.balanceOf(App.YOUR_ADDRESS);

    if (currentStakedAmount.gt(0)) {
        showLoading();
        REWARD_POOL.withdraw(currentStakedAmount)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const yCrvContract_unstake_amount = async function(amount, rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);
    const currentStakedAmount = ethers.utils.parseEther(amount);

    if (currentStakedAmount.gt(0)) {
        showLoading();
        REWARD_POOL.withdraw(currentStakedAmount)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const yCrvContract_claim = async function(rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);

    console.log(App.YOUR_ADDRESS);

    const earnedYFFI = await WEEBTEND_V2_TOKEN.earned(App.YOUR_ADDRESS);
    console.log(earnedYFFI, earnedYFFI.gt(0))
    // const earnedYFFIFormated = ethers.utils.parseUnits(earnedYFFI, 18);

    if (earnedYFFI.gt(0)) {
        showLoading();
        WEEBTEND_V2_TOKEN.getReward()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const yCrvContract_claim_LP = async function(rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);

    console.log(App.YOUR_ADDRESS);

    const earnedLP = await WEEBTEND_V2_TOKEN.unrealizedProfit(App.YOUR_ADDRESS);
    console.log(earnedLP, earnedLP.gt(0))
    // const earnedLPFormated = ethers.utils.parseUnits(earnedLP, 18);

    if (earnedLP.gt(0)) {
        showLoading();
        WEEBTEND_V2_TOKEN.claim()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const yCrvContract_exit = async function(rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);
    const currentStakedAmount = await REWARD_POOL.balanceOf(App.YOUR_ADDRESS);
    // const currentStakedAmountFormated = ethers.utils.parseUnits(currentStakedAmount, 18);

    if (currentStakedAmount.gt(0)) {
        showLoading();
        REWARD_POOL.exit()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const yCrvContract_harvest = async function(rewardPoolAddr, App) {
    const signer = App.provider.getSigner();
    const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);

    if (earnedLP > 0) {
        showLoading();
        WEEBTEND_V2_TOKEN.harvest()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};