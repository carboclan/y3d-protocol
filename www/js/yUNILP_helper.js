/**
 * 
 * @param {string} yUniTokenAddr yUNI token address
 * @param {string} uniTokenAddr UNI token address
 * @param {string} owner App.YOUR_ADDRESS
 * @param {string} amount Amount
 * @param {object} App Ethers instance
 */
const yUniContract_stake = async function(yUniTokenAddr, uniTokenAddr, owner, amount, App) {
    const signer = App.provider.getSigner();
    const uniContract = new ethers.Contract(uniTokenAddr, YCRV_ABI, signer);
    const yUniContract = new ethers.Contract(yUniTokenAddr, YYCRV_ABI, signer);
    const amt = ethers.utils.parseEther(amount);
    let allow = Promise.resolve();
    if (amt.gt(0)) {
        showLoading();
        const allowance = await uniContract.allowance(owner, yUniTokenAddr)
        if (allowance == 0) {
            allow = uniContract.approve(yUniTokenAddr, ethers.constants.MaxUint256).then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function(e) {
                hideLoading();
                console.log(e)
                alert("Try resetting your approval to 0 first");
            });
        }

        allow.then(async function() {
            yUniContract.stake(amt).then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).then(function(result) {
                console.log("Stake result:", result);
                if (result.status === 1) {
                    hideLoading();
                    alert("Success!");
                }
            }).catch(function(e) {
                console.log("Stake error:", e);
                hideLoading();
                alert(`Something went wrong, \nDetails: "${e.message}".`);
            });
        }).catch(function () {
            hideLoading();
            _print("Something went wrong.");
        });
    }
};

/**
 * 
 * @param {string} contractAddr yUNI token address
 * @param {string} owner App.YOUR_ADDRESS
 * @param {string} amount Amount
 * @param {object} App Ethers instance
 */
const yUniContract_unstake = async function(contractAddr, owner, amount, App) {
    const signer = App.provider.getSigner();
    const contract = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    const amt = ethers.utils.parseEther(amount);
    let allow = Promise.resolve();
    if (amt.gt(0)) {
        showLoading();
        allow.then(async function() {
            contract.unstake(amt).then(function(t) {
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
                alert(`Something went wrong, \nDetails: "${e.message}".`);
            });
        }).catch(function () {
            hideLoading();
            _print("Something went wrong.");
        });
    }
};

/**
 * 
 * @param {string} yUniTokenAddr yUNI token address
 * @param {string} uniTokenAddr UNI token address
 * @param {string} amount Amount
 * @param {object} App Ethers instance
 */
const yUniContract_make_profit = async function(yUniTokenAddr, uniTokenAddr, amount, App) {
    const signer = App.provider.getSigner();
    const uniContract = new ethers.Contract(uniTokenAddr, YCRV_ABI, signer);
    const yUniContract = new ethers.Contract(yUniTokenAddr, YYCRV_ABI, signer);
    const amt = ethers.utils.parseEther(amount);
    let allow = Promise.resolve();
    if (amt.gt(0)) {
        showLoading();
        allow = uniContract.approve(yUniTokenAddr, ethers.constants.MaxUint256).then(function(t) {
            return App.provider.waitForTransaction(t.hash);
        }).catch(function(e) {
            hideLoading();
            console.log(e)
            alert("Try resetting your approval to 0 first");
        });

        allow.then(async function() {
            yUniContract.make_profit_external(amt).then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function(e) {
                console.log("Make profit error:", e);
                hideLoading();
                _print(`Something went wrong, \nDetails: "${e.message}".`);
            });
        }).catch(function () {
            hideLoading();
            _print("Something went wrong.");
        });
    }
};

/**
 * 
 * @param {string} contractAddr yUNI token address
 * @param {object} App Ethers instance
 */
const yUniContract_deposit_all = async function(contractAddr, App) {
    const signer = App.provider.getSigner();
    const contract = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    showLoading();
    contract.deposit_all().then(function(t) {
        return App.provider.waitForTransaction(t.hash);
    }).catch(function(e) {
        console.log("Deposit all error:", e);
        hideLoading();
        _print(`Something went wrong, \nDetails: "${e.message}".`);
    });
};

/**
 * 
 * @param {string} contractAddr yUNI token address
 * @param {object} App Ethers instance
 */
const yUniContract_deposit = async function(contractAddr, App) {
    const signer = App.provider.getSigner();
    const contract = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    showLoading();
    contract.deposit().then(function(t) {
        return App.provider.waitForTransaction(t.hash);
    }).catch(function(e) {
        console.log("Deposit error:", e);
        hideLoading();
        _print(`Something went wrong, \nDetails: "${e.message}".`);
    });
};

/**
 * 
 * @param {string} contractAddr yUNI token address
 * @param {object} App Ethers instance
 */
const yUniContract_harvest_to_consul = async function(contractAddr, App) {
    const signer = App.provider.getSigner();
    const contract = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    showLoading();
    contract.harvest_to_consul().then(function(t) {
        return App.provider.waitForTransaction(t.hash);
    }).catch(function(e) {
        console.log("Harvest to consul error:", e);
        hideLoading();
        _print(`Something went wrong, \nDetails: "${e.message}".`);
    });
};

/**
 * 
 * @param {string} contractAddr yUNI token address
 * @param {object} App Ethers instance
 */
const yUniContract_harvest_to_uniswap = async function(contractAddr, App) {
    const signer = App.provider.getSigner();
    const contract = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    showLoading();
    contract.harvest_to_uniswap().then(function(t) {
        return App.provider.waitForTransaction(t.hash);
    }).catch(function(e) {
        console.log("Harvest to uniswap error:", e);
        hideLoading();
        _print(`Something went wrong, \nDetails: "${e.message}".`);
    });
};

/**
 * 
 * @param {string} contractAddr yUNI token address
 * @param {string} amount Amount
 * @param {object} App Ethers instance
 */
const yUniContract_withdraw = async function(contractAddr, amount, App) {
    const signer = App.provider.getSigner();
    const contract = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    const amt = ethers.utils.parseEther(amount);
    if (amt.gt(0)) {
        showLoading();
        contract.withdraw(amt).then(function(t) {
            return App.provider.waitForTransaction(t.hash);
        }).catch(function(e) {
            console.log("Withdraw error:", e);
            hideLoading();
            _print(`Something went wrong, \nDetails: "${e.message}".`);
        });
    }
};
