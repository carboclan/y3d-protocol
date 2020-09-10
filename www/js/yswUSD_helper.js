// #region yyCRV Functions
// ============================== yyCRV ==============================
const yyCrvContract_stake = async function(contractAddr, yCrvTokenAddr, owner, amount, App) {
    const signer = App.provider.getSigner();
    const yCRV_TOKEN = new ethers.Contract(yCrvTokenAddr, YCRV_ABI, signer);
    const yyCRV = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    const amt = ethers.utils.parseEther(amount);
    let allow = Promise.resolve();
    if (amt.gt(0)) {
        showLoading();
        const allowance = await yCRV_TOKEN.allowance(owner, contractAddr)
        if (allowance == 0) {
            allow = yCRV_TOKEN.approve(contractAddr, ethers.constants.MaxUint256).then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function(e) {
                hideLoading();
                console.log(e)
                alert("Try resetting your approval to 0 first");
            });
        }

        allow.then(async function() {
            yyCRV.stake(amt).then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).then(function(result) {
                console.log("Stake result:", result);
                if (result.status === 1) {
                    hideLoading();
                    alert("Success!");
                }
            }).catch(function() {
                hideLoading();
                alert("Something went wrong.");
            });
        }).catch(function () {
            hideLoading();
            _print("Something went wrong.");
        });
    }
};

const yyCrvContract_unstake = async function(contractAddr, owner, amount, App) {
    const signer = App.provider.getSigner();
    const yyCRV = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    const amt = ethers.utils.parseEther(amount);
    let allow = Promise.resolve();
    if (amt.gt(0)) {
        showLoading();
        allow.then(async function() {
            yyCRV.unstake(amt).then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).then(function(result) {
                console.log("Unstake result:", result);
                if (result.status === 1) {
                    hideLoading();
                    alert("Success!");
                }
            }).catch(function(e) {
                console.log("Unstake error:", e);
                hideLoading();
                alert("Something went wrong, \"" + e.message + "\".");
            });
        }).catch(function () {
            hideLoading();
            _print("Something went wrong.");
        });
    }
};

const yyCrvContract_make_profit = async function(contractAddr, yCrvTokenAddr, amount, App) {
    const signer = App.provider.getSigner();
    const yCRV_TOKEN = new ethers.Contract(yCrvTokenAddr, YCRV_ABI, signer);
    const yyCRV = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    const amt = ethers.utils.parseEther(amount);
    let allow = Promise.resolve();
    if (amt.gt(0)) {
        showLoading();
        allow = yCRV_TOKEN.approve(contractAddr, ethers.constants.MaxUint256).then(function(t) {
            return App.provider.waitForTransaction(t.hash);
        }).catch(function(e) {
            hideLoading();
            console.log(e)
            alert("Try resetting your approval to 0 first");
        });

        allow.then(async function() {
            yyCRV.make_profit_external(amt).then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                _print("Something went wrong.");
            });
        }).catch(function () {
            hideLoading();
            _print("Something went wrong.");
        });
    }
};

const yyCrvContract_deposit_all = async function(contractAddr, App) {
    const signer = App.provider.getSigner();
    const yyCRV = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    showLoading();
    yyCRV.deposit_all().then(function(t) {
        return App.provider.waitForTransaction(t.hash);
    }).catch(function() {
        hideLoading();
    });
};

const yyCrvContract_deposit = async function(contractAddr, App) {
    const signer = App.provider.getSigner();
    const yyCRV = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    showLoading();
    yyCRV.deposit().then(function(t) {
        return App.provider.waitForTransaction(t.hash);
    }).catch(function() {
        hideLoading();
    });
};

const yyCrvContract_harvest_to_consul = async function(contractAddr, App) {
    const signer = App.provider.getSigner();
    const yyCRV = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    showLoading();
    yyCRV.harvest_to_consul().then(function(t) {
        return App.provider.waitForTransaction(t.hash);
    }).catch(function() {
        hideLoading();
    });
};

const yyCrvContract_harvest_to_uniswap = async function(contractAddr, App) {
    const signer = App.provider.getSigner();
    const yyCRV = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    showLoading();
    yyCRV.harvest_to_uniswap().then(function(t) {
        return App.provider.waitForTransaction(t.hash);
    }).catch(function() {
        hideLoading();
    });
};

const yyCrvContract_withdraw = async function(contractAddr, amount, App) {
    const signer = App.provider.getSigner();
    const yyCRV = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    const amt = ethers.utils.parseEther(amount);
    if (amt.gt(0)) {
        showLoading();
        yyCRV.withdraw(amt).then(function(t) {
            return App.provider.waitForTransaction(t.hash);
        }).catch(function() {
            hideLoading();
        });
    }
};
// #endregion yyCRV Functions