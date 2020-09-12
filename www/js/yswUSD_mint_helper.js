// #region Mint Functions
const uniDepositContract_deposit_n_claim = async function(amount, usdtAddr, unitedMintAddr, App) {
    const signer = App.provider.getSigner();

    const USDT_TOKEN_SIGNED = new ethers.Contract(usdtAddr, ERC20_ABI,signer);
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(unitedMintAddr, UNITED_MINT_ABI ,signer);

//    const currentUSDT = await USDT_TOKEN_SIGNED.balanceOf(App.YOUR_ADDRESS);
    const currentUSDT = ethers.utils.parseUnits(amount, 6);  
    const allowedUSDT = await USDT_TOKEN_SIGNED.allowance(App.YOUR_ADDRESS, unitedMintAddr);

    let allow = Promise.resolve();

    if (allowedUSDT.lt(currentUSDT)) {
        showLoading();
        allow = USDT_TOKEN_SIGNED.approve(unitedMintAddr, ethers.constants.MaxUint256)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                alert("Try resetting your approval to 0 first");
            });
    }

    if (currentUSDT.gt(0)) {
        showLoading();
        allow.then(async function() {
            UNI_DEPOSIT_SIGNED.depositAndClaim(currentUSDT).then(function(t) {
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
        alert("You have no tokens to deposit!!");
    }
};

const uniDepositContract_deposit = async function(usdtAddr, unitedMintAddr, App) {
    const signer = App.provider.getSigner();

    const USDT_TOKEN_SIGNED = new ethers.Contract(usdtAddr, ERC20_ABI,signer);
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(unitedMintAddr, UNITED_MINT_ABI, signer);

    const currentUSDT = await USDT_TOKEN_SIGNED.balanceOf(App.YOUR_ADDRESS);
    const allowedUSDT = await USDT_TOKEN_SIGNED.allowance(App.YOUR_ADDRESS, unitedMintAddr);

    let allow = Promise.resolve();

    if (allowedUSDT.lt(currentUSDT)) {
        showLoading();
        allow = USDT_TOKEN_SIGNED.approve(unitedMintAddr, ethers.constants.MaxUint256)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                alert("Try resetting your approval to 0 first");
            });
    }

    if (currentUSDT.gt(0)) {
        showLoading();
        allow.then(async function() {
            UNI_DEPOSIT_SIGNED.deposit(currentUSDT).then(function(t) {
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
        alert("You have no tokens to deposit!!");
    }
};

const uniDepositContract_deposit_amount = async function(amount, usdtAddr, unitedMintAddr, App) {
    const signer = App.provider.getSigner();

    const USDT_TOKEN_SIGNED = new ethers.Contract(usdtAddr, ERC20_ABI,signer);
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(unitedMintAddr, UNITED_MINT_ABI, signer);
    console.info('uniDepositContract_deposit_amount::amount', amount)
    const currentUSDT = ethers.utils.parseUnits(amount, 6);
    console.info('uniDepositContract_deposit_amount::currentUSDT', currentUSDT)
    const allowedUSDT = await USDT_TOKEN_SIGNED.allowance(App.YOUR_ADDRESS, unitedMintAddr);

    let allow = Promise.resolve();

    if (allowedUSDT.lt(currentUSDT)) {
        showLoading();
        allow = USDT_TOKEN_SIGNED.approve(unitedMintAddr, ethers.constants.MaxUint256)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                alert("Try resetting your approval to 0 first");
            });
    }

    if (currentUSDT.gt(0)) {
        showLoading();
        allow.then(async function() {
            UNI_DEPOSIT_SIGNED.deposit(currentUSDT).then(function(t) {
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
        alert("You have no tokens to deposit!!");
    }
};

const uniDepositContract_mint = async function(unitedMintAddr, App) {
    const signer = App.provider.getSigner();
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(unitedMintAddr, UNITED_MINT_ABI ,signer);
    const currentUnmintedUsdt = await UNI_DEPOSIT_SIGNED.unminted_USDT();

    if (currentUnmintedUsdt > 0) {
        showLoading();
        UNI_DEPOSIT_SIGNED.mint()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    } else {
        alert("Current have no USDT for yCrv to mint!!");
    }
};

const uniDepositContract_claim = async function(unitedMintAddr, App) {
    const signer = App.provider.getSigner();
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(unitedMintAddr, UNITED_MINT_ABI ,signer);
    const currentMinted_yyCrv = await UNI_DEPOSIT_SIGNED.minted_yswUSD();

    if (currentMinted_yyCrv > 0) {
        showLoading();
        UNI_DEPOSIT_SIGNED.claim()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    } else {
        alert("Current there are no yyCrv to claim!!");
    }
};

const uniDepositContract_restore = async function(unitedMintAddr, yyCrvTokenAddr, App) {
    const signer = App.provider.getSigner();

    const yyCrv_TOKEN_SIGNED = new ethers.Contract(yyCrvTokenAddr, ERC20_ABI, signer);
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(unitedMintAddr, UNITED_MINT_ABI, signer);

    const current_yyCrv = await yyCrv_TOKEN_SIGNED.balanceOf(App.YOUR_ADDRESS);
    const allowed_yCrv = await yyCrv_TOKEN_SIGNED.allowance(App.YOUR_ADDRESS, unitedMintAddr);

    let allow = Promise.resolve();

    if (allowed_yCrv.lt(current_yyCrv)) {
        showLoading();
        allow = yyCrv_TOKEN_SIGNED.approve(unitedMintAddr, ethers.constants.MaxUint256)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                alert("Try resetting your approval to 0 first");
            });
    }

    if (current_yyCrv.gt(0)) {
        showLoading();
        allow.then(async function() {
            UNI_DEPOSIT_SIGNED.restore(current_yyCrv).then(function(t) {
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
        alert("You have no tokens to withdraw!!");
    }
};

const uniDepositContract_restore_amount = async function(amount, unitedMintAddr, yyCrvTokenAddr, App) {
    const signer = App.provider.getSigner();

    const yyCrv_TOKEN_SIGNED = new ethers.Contract(yyCrvTokenAddr, ERC20_ABI, signer);
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(unitedMintAddr, UNITED_MINT_ABI, signer);

    const current_yyCrv = ethers.utils.parseUnits(amount, 18);
    const allowed_yCrv = await yyCrv_TOKEN_SIGNED.allowance(App.YOUR_ADDRESS, unitedMintAddr);

    let allow = Promise.resolve();

    if (allowed_yCrv.lt(current_yyCrv)) {
        showLoading();
        allow = yyCrv_TOKEN_SIGNED.approve(unitedMintAddr, ethers.constants.MaxUint256)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                alert("Try resetting your approval to 0 first");
            });
    }

    if (current_yyCrv.gt(0)) {
        showLoading();
        allow.then(async function() {
            UNI_DEPOSIT_SIGNED.restore(current_yyCrv).then(function(t) {
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
        alert("You have no tokens to restore!!");
    }
};
// #endregion Mint Functions