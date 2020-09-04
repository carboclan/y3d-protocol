async function init_ethers() {
    const App = {};

    const ETHEREUM_NODE_URL = "aHR0cHM6Ly9tYWlubmV0LmluZnVyYS5pby92My9mN2Q1YjkwMzY3MzY0YmFkYWNhZDI5Njg5OWYyMTMxYQ==";

    let isMetaMaskInstalled = true;

    // Modern dapp browsers...
    if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
            // Request account access
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }
        App.provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        App.provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    }
    // If no injected web3 instance is detected, fall back to backup node
    else {
        App.provider = new ethers.providers.JsonRpcProvider(atob(ETHEREUM_NODE_URL));
        isMetaMaskInstalled = false;
        _print("You don't have MetaMask installed! Falling back to backup node...\n (will likely to fail. Please install MetaMask extension).\n")
        sleep(10);
    }

    App.YOUR_ADDRESS = getUrlParameter("addr");

    // Cloud not load URL parameter
    if (!App.YOUR_ADDRESS) {
        if (!isMetaMaskInstalled) {

            if (localStorage.hasOwnProperty('addr')) {
                App.YOUR_ADDRESS = localStorage.getItem('addr');
            } else {
                App.YOUR_ADDRESS = window.prompt("Enter your eth address.");
            }

        } else {
            let accounts = await App.provider.listAccounts();
            App.YOUR_ADDRESS = accounts[0];
        }
    }

    if (!App.YOUR_ADDRESS || !ethers.utils.isAddress(App.YOUR_ADDRESS)) {
        throw "Could not initialize your address. Make sure your address is checksum valid.";
    }

    localStorage.setItem('addr', App.YOUR_ADDRESS);
    return App;
}

const getUrlParameter = function(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};


const toFixed = function(num, fixed) {
    const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    const arr = num.toString().match(re);
    if (arr && arr.length > 0) {
        return arr[0];
    } else {
        return "0";
    }
};


const start = function (f) {
    f().catch((e)=> {
        _print(e);
        console.error(e);
        _print("Oops something went wrong. Try refreshing the page.")
    });
};

let logger;

const consoleInit = function() {
    logger = document.getElementById('log');
    _print(new Date().toString());
    _print("");
};

const _print = function(message) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            logger.innerHTML += arguments[i] + '<br />';
        }
    }
};

const _print_bold = function(message) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += '<b>' + (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '</b><br />';
        } else {
            logger.innerHTML += '<b>' + arguments[i] + '</b><br />';
        }
    }
};

const _print_link = function(message, onclickFunction) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    const uuid = ID();

    logger.innerHTML += '<a href="#" id=' + uuid + '>' + message + '</a><br />';

    $(document).ready(function() {
        $('#' + uuid).click(function(){
            console.log("clicked");
            onclickFunction();
        });
    });
};

const _print_button = function(message, onclickFunction) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    const uuid = ID();

    logger.innerHTML += '<button type="button" id=' + uuid + '>' + message + '</button>';

    $(document).ready(function() {
        $('#' + uuid).click(function(){
            console.log("clicked");
            onclickFunction();
        });
    });
};

const _print_button_input = function(message, defaultValue, onclickFunction) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    const uuid = ID();
    const input_uuid = ID();

    logger.innerHTML += '<button type="button" id=' + uuid + '>' + message + '</button>';
    logger.innerHTML += '<input type="text" id=' + input_uuid + ' value="'+ defaultValue +'"></input>';
    $(document).ready(function() {
        $('#' + uuid).click(function(){
            const value = $('#' + input_uuid).val();
            onclickFunction(value);
        });
    });
};

const _print_href = function(message, href) {
    if (!logger) {
        logger = document.getElementById('log');
    }

    const uuid = ID();

    logger.innerHTML += `<a href="${href}" target="_blank" id="${uuid}">${message}</a><br />`;
};

const sleep = function(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};

const lookUpPrices = async function(id_array) {
    let ids = id_array.join("%2C");
    return $.ajax({
        url: "https://api.coingecko.com/api/v3/simple/price?ids=" + ids + "&vs_currencies=usd",
        type: 'GET'
    });
};

const getBlockTime = function() {
    _print("Fetching current block time...");
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://etherchain.org/api/basic_stats",
            type: 'GET',
            success: function (data, text) {
                if (data["currentStats"] && data["currentStats"]["block_time"]) {
                    resolve(data["currentStats"]["block_time"]);
                    return;
                }

                _print(`Etherchain basic stats is invalid. ${data}`);
                _print("Using backup data...");
                resolve(BLOCK_TIME);
            },
            error: function (request, status, error) {
                _print("Could not get etherchain basic stats.");
                _print(request.responseText);
                _print("Using backup data...");
                resolve(BLOCK_TIME);
            }
        })
    })
}

const printBALRewards = async function(synthStakingPoolAddr, BALPrice, percentageOfBalancerPool) {

};

const getLatestTotalBALAmount = async function (addr) {
    const bal_earnings = await getBALEarnings(addr, BAL_DISTRIBUTION_WEEK - 1);
    return bal_earnings[0];
};

const safeParseFloat = function(str) {
  let res = parseFloat(str);
  return res ? res : 0;
};

const getBALEarnings = async function(addr, startWeek) {

    // SNX-usdc Redirect
    if (addr.toLowerCase() === "0xfbaedde70732540ce2b11a8ac58eb2dc0d69de10") {
        addr = "0xEb3107117FEAd7de89Cd14D463D340A2E6917769";
    }

    const bal_earnings = [];

    for (let i = startWeek; i < BAL_DISTRIBUTION_WEEK ; i++) {
        const data = await $.getJSON(`../../js/bal_rewards/week${i + 1}.json`);
        const earning_checksum = safeParseFloat(data[addr]);

        if (earning_checksum === 0) {
            const earning = safeParseFloat(data[addr.toLowerCase()]) + earning_checksum;
            bal_earnings.push(earning);
        }
        else {
            bal_earnings.push(earning_checksum);
        }
    }

    return bal_earnings;
};

const get_synth_weekly_rewards = async function(synth_contract_instance) {
    if (await isRewardPeriodOver(synth_contract_instance)) {
        return 0;
    }

    const rewardRate = await synth_contract_instance.rewardRate();
    return Math.round((rewardRate) * 604800);
};

const isRewardPeriodOver = async function(reward_contract_instance) {
    const now = Date.now() / 1000;
    const periodFinish = await getPeriodFinishForReward(reward_contract_instance);
    return (periodFinish < now);
};

const getPeriodFinishForReward = async function (reward_contract_instance) {
    return await reward_contract_instance.periodFinish();
};

const ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

function sleep_async(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 *
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the the amount of time
 */
const forHumans = function ( seconds ) {
    const levels = [
        [Math.floor(seconds / 31536000), 'years'],
        [Math.floor((seconds % 31536000) / 86400), 'days'],
        [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
        [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
        [Math.floor((((seconds % 31536000) % 86400) % 3600) % 60), 'seconds'],
    ];
    let returntext = '';

    for (var i = 0, max = levels.length; i < max; i++) {
        if ( levels[i][0] === 0 ) continue;
        returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
    }

    return returntext.trim();
};

const showLoading = function() {
    $('.loader--1').eq(0).show();
};

const hideLoading = function() {
    $('.loader--1').eq(0).hide();
}

const toDollar = formatter.format;

const rewardsContract_resetApprove = async function(stakingTokenAddr, rewardPoolAddr, App) {

    const signer = App.provider.getSigner();

    const STAKING_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, signer);

    showLoading();

    STAKING_TOKEN.approve(rewardPoolAddr, 0)
        .then(function(t) {
            return App.provider.waitForTransaction(t.hash);
        }).catch(function() {
            hideLoading();
        });
};

const rewardsContract_stake = async function(stakingTokenAddr, rewardPoolAddr, App) {

        const signer = App.provider.getSigner();

        const TEND_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, signer);
        const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);

        const currentTEND = await TEND_TOKEN.balanceOf(App.YOUR_ADDRESS);
        const allowedTEND = await TEND_TOKEN.allowance(App.YOUR_ADDRESS, rewardPoolAddr);

        let allow = Promise.resolve();

        if ((allowedTEND / 1e18) < (currentTEND / 1e18)) {
            showLoading();
            allow = TEND_TOKEN.approve(rewardPoolAddr, ethers.constants.MaxUint256)
                .then(function(t) {
                    return App.provider.waitForTransaction(t.hash);
                }).catch(function() {
                    hideLoading();
                    alert("Try resetting your approval to 0 first");
                });
        }

        if ((currentTEND / 1e18) > 0) {
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

const rewardsContract_stake_amount = async function(amount, stakingTokenAddr, rewardPoolAddr, App) {

        const signer = App.provider.getSigner();

        const TEND_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, signer);
        const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);

        const currentTEND = ethers.utils.parseEther(amount);
        const allowedTEND = await TEND_TOKEN.allowance(App.YOUR_ADDRESS, rewardPoolAddr);

        let allow = Promise.resolve();

        if ((allowedTEND / 1e18) < (currentTEND / 1e18)) {
            showLoading();
            allow = TEND_TOKEN.approve(rewardPoolAddr, ethers.constants.MaxUint256)
                .then(function(t) {
                    return App.provider.waitForTransaction(t.hash);
                }).catch(function() {
                    hideLoading();
                    alert("Try resetting your approval to 0 first");
                });
        }

        if ((currentTEND / 1e18) > 0) {
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

const rewardsContract_stakeWBTC = async function(stakingTokenAddr, rewardPoolAddr, App) {

    const signer = App.provider.getSigner();

    const TEND_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, signer);
    const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);

    const currentTEND = await TEND_TOKEN.balanceOf(App.YOUR_ADDRESS);
    const allowedTEND = await TEND_TOKEN.allowance(App.YOUR_ADDRESS, rewardPoolAddr);

    let allow = Promise.resolve();

    if ((allowedTEND / 1e8) < (currentTEND / 1e8)) {
        showLoading();
        allow = TEND_TOKEN.approve(rewardPoolAddr, ethers.constants.MaxUint256)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                alert("Try resetting your approval to 0 first");
            });
    }

    if ((currentTEND / 1e7) > 0) {
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

const rewardsContract_unstake = async function(rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);
    const currentStakedAmount = await REWARD_POOL.balanceOf(App.YOUR_ADDRESS);

    if (currentStakedAmount > 0) {
        showLoading();
        REWARD_POOL.withdraw(currentStakedAmount)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const uniDepositContract_deposit = async function(usdtAddr, uniDepositAddr, App) {
    const signer = App.provider.getSigner();

    const USDT_TOKEN_SIGNED = new ethers.Contract(usdtAddr, ERC20_ABI,signer);
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(uniDepositAddr, UNI_DEPOSIT_ABI ,signer);

    const currentUSDT = await USDT_TOKEN_SIGNED.balanceOf(App.YOUR_ADDRESS);
    const allowedUSDT = await USDT_TOKEN_SIGNED.allowance(App.YOUR_ADDRESS, uniDepositAddr);

    let allow = Promise.resolve();

    if ((allowedUSDT / 1e8) < (currentUSDT / 1e8)) {
        showLoading();
        allow = USDT_TOKEN_SIGNED.approve(uniDepositAddr, ethers.constants.MaxUint256)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                alert("Try resetting your approval to 0 first");
            });
    }

    if ((currentUSDT / 1e6) > 0) {
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

const uniDepositContract_mint = async function(uniDepositAddr, App) {
    const signer = App.provider.getSigner();
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(uniDepositAddr, UNI_DEPOSIT_ABI ,signer);
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

const uniDepositContract_claim = async function(uniDepositAddr, App) {
    const signer = App.provider.getSigner();
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(uniDepositAddr, UNI_DEPOSIT_ABI ,signer);
    const currentMinted_yCrv = await UNI_DEPOSIT_SIGNED.minted_yCRV();

    if (currentMinted_yCrv > 0) {
        showLoading();
        UNI_DEPOSIT_SIGNED.claim()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const uniDepositContract_withdraw = async function(uniDepositAddr, yCrvTokenAddr, App) {
    const signer = App.provider.getSigner();

    const yCrv_TOKEN_SIGNED = new ethers.Contract(yCrvTokenAddr, ERC20_ABI, signer);
    const UNI_DEPOSIT_SIGNED = new ethers.Contract(uniDepositAddr, UNI_DEPOSIT_ABI, signer);

    const current_yCrv = await yCrv_TOKEN_SIGNED.balanceOf(App.YOUR_ADDRESS);
    const allowed_yCrv = await yCrv_TOKEN_SIGNED.allowance(App.YOUR_ADDRESS, uniDepositAddr);

    let allow = Promise.resolve();

    if ((allowed_yCrv / 1e8) < (current_yCrv / 1e8)) {
        showLoading();
        allow = yCrv_TOKEN_SIGNED.approve(uniDepositAddr, ethers.constants.MaxUint256)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
                hideLoading();
                alert("Try resetting your approval to 0 first");
            });
    }

    if ((current_yCrv / 1e6) > 0) {
        showLoading();
        allow.then(async function() {
            UNI_DEPOSIT_SIGNED.withdraw(current_yCrv).then(function(t) {
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

const rewardsContract_unstake_amount = async function(amount, rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);
    const currentStakedAmount = ethers.utils.parseEther(amount);

    if (currentStakedAmount > 0) {
        showLoading();
        REWARD_POOL.withdraw(currentStakedAmount)
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const rewardsContract_exit = async function(rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);
    const currentStakedAmount = (await REWARD_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18;

    if (currentStakedAmount > 0) {
        showLoading();
        REWARD_POOL.exit()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const rewardsContract_exitWBTC = async function(rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);
    const currentStakedAmount = (await REWARD_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e7;

    if (currentStakedAmount > 0) {
        showLoading();
        REWARD_POOL.exit()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const rewardsContract_claim = async function(rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);

    console.log(App.YOUR_ADDRESS);

    const earnedYFFI = (await WEEBTEND_V2_TOKEN.earned(App.YOUR_ADDRESS)) / 1e18;

    if (earnedYFFI > 0) {
        showLoading();
        WEEBTEND_V2_TOKEN.getReward()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const rewardsContract_claim_LP = async function(rewardPoolAddr, App) {
    const signer = App.provider.getSigner();

    const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, P_STAKING_POOL_ABI, signer);

    console.log(App.YOUR_ADDRESS);

    const earnedLP = (await WEEBTEND_V2_TOKEN.unrealizedProfit(App.YOUR_ADDRESS)) / 1e18;

    if (earnedLP > 0) {
        showLoading();
        WEEBTEND_V2_TOKEN.claim()
            .then(function(t) {
                return App.provider.waitForTransaction(t.hash);
            }).catch(function() {
            hideLoading();
        });
    }
};

const rewardsContract_harvest = async function(rewardPoolAddr, App) {
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

// ============================== yyCRV ==============================
const yyCrvContract_stake = async function(contractAddr, yCrvTokenAddr, owner, amount, App) {
    const signer = App.provider.getSigner();
    const yCRV_TOKEN = new ethers.Contract(yCrvTokenAddr, YCRV_ABI, signer);
    const yyCRV = new ethers.Contract(contractAddr, YYCRV_ABI, signer);
    const amt = ethers.utils.parseEther(amount);
    let allow = Promise.resolve();
    if (amt > 0) {
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
    if (amt > 0) {
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
    if (amt > 0) {
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
    if (amt > 0) {
        showLoading();
        yyCRV.withdraw(amt).then(function(t) {
            return App.provider.waitForTransaction(t.hash);
        }).catch(function() {
            hideLoading();
        });
    }
};

const print_warning = function() {
    _print_bold("WARNING: Do audit the contract before staking any asset!\n")
};