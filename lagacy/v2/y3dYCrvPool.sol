/**
 *Submitted for verification at Etherscan.io on 2020-08-23
*/

pragma solidity ^0.6.0;

/*
 ___    ___ ________  ________     
 |\  \  /  /|\_____  \|\   ___ \    
 \ \  \/  / \|____|\ /\ \  \_|\ \   
  \ \    / /      \|\  \ \  \ \\ \  
   \/  /  /      __\_\  \ \  \_\\ \ 
 __/  / /       |\_______\ \_______\
|\___/ /        \|_______|\|_______|
\|___|/                             
                                    */

// Unipool Contract Fork from Aragon
// https://etherscan.io/address/0xEA4D68CF86BcE59Bf2bFA039B97794ce2c43dEBC#code

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev Standard math utilities missing in the Solidity language.
 */
library Math {
    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow, so we distribute
        return (a / 2) + (b / 2) + ((a % 2 + b % 2) / 2);
    }
}

interface ICrvDeposit{
    function deposit(uint256) external;
    function withdraw(uint256) external;
    function balanceOf(address) external view returns (uint256);
    function claimable_tokens(address) external view returns (uint256);
}

interface ICrvMinter{
    function mint(address) external;
}

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for ERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        // solhint-disable-next-line max-line-length
        require((value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).add(value);
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender).sub(value, "SafeERC20: decreased allowance below zero");
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves.

        // A Solidity high level call has three parts:
        //  1. The target address is checked to verify it contains contract code
        //  2. The call itself is made, and success asserted
        //  3. The return value is decoded, which in turn checks the size of the returned data.
        // solhint-disable-next-line max-line-length
        require(address(token).isContract(), "SafeERC20: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = address(token).call(data);
        require(success, "SafeERC20: low-level call failed");

        if (returndata.length > 0) { // Return data is optional
            // solhint-disable-next-line max-line-length
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

abstract contract LPTokenWrapper is ERC20 {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public constant LPT = IERC20(0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8); // yCrv
    IERC20 constant public CRV = IERC20(0xD533a949740bb3306d119CC777fa900bA034cd52);
    address constant public crv_deposit = address(0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1);
    address constant public crv_minter = address(0xd061D61a4d941c39E5453435B6345Dc261C2fcE0);
    address public crv_manager = address(0x6465F1250c9fe162602Db83791Fc3Fb202D70a7B);    

    uint256 public _pool;
    uint256 public _profitPerShare; // x 1e18, monotonically increasing.
    mapping(address => uint256) public _unrealized; // x 1e18
    mapping(address => uint256) public _realized; // last paid _profitPerShare
    bool public exodus;
    event LPTPaid(address indexed user, uint256 profit);

    function unrealizedProfit(address account) public view returns (uint256) {
        return _unrealized[account].add(balanceOf(account).mul(_profitPerShare.sub(_realized[account])).div(1e18));
    }    

    function make_profit(uint256 amount) internal {
        _profitPerShare = _profitPerShare.add(amount.mul(1e18).div(totalSupply()));        
    }

    modifier update(address account) {
        // Tells the contract that the buyer doesn't deserve dividends for the tokens before they owned them;
        // really i know you think you do but you don't
        // https://etherscan.io/address/0xb3775fb83f7d12a36e0475abdd1fca35c091efbe#code
        if (account != address(0)) {
            _unrealized[account] = unrealizedProfit(account);
            _realized[account] = _profitPerShare;
        }
        _;
    }    

    function stake(uint256 amount) update(msg.sender) virtual public {
        _mint(msg.sender, amount);
        LPT.safeTransferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) update(msg.sender) virtual public {
        _burn(msg.sender, amount);
        uint256 tax = amount.div(20); if (exodus == true) tax = 0;
        amount = amount.sub(tax);
        if (amount > LPT.balanceOf(address(this))) ICrvDeposit(crv_deposit).withdraw(amount - LPT.balanceOf(address(this)));
        LPT.safeTransfer(msg.sender, amount);
        make_profit(tax);
    }

    function claim() update(msg.sender) public {
        uint256 profit = _unrealized[msg.sender];
        if (profit != 0) {
            _unrealized[msg.sender] = 0;
            LPT.safeTransfer(msg.sender, profit);
            emit LPTPaid(msg.sender, profit);
        }
    }
}

abstract contract y3dPool is LPTokenWrapper {
    uint256 public DURATION = 30 days;
    uint256 public periodFinish;
    uint256 public rewardRate;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    IERC20 constant public Y3D = IERC20(0xc7fD9aE2cf8542D71186877e21107E1F3A0b55ef);

    constructor() public {
        _mint(msg.sender, 1); // avoid divided by 0
        LPT.approve(crv_deposit, uint(-1));
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }

    function rewardPerToken() public view returns (uint256) {
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable()
                    .sub(lastUpdateTime)
                    .mul(rewardRate)
                    .mul(1e18)
                    .div(totalSupply())
            );
    }

    function earned(address account) public view returns (uint256) {
        return
            balanceOf(account)
                .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
                .div(1e18)
                .add(rewards[account])
            ;
    }

    // stake visibility is public as overriding LPTokenWrapper's stake() function
    function stake(uint256 amount) public override updateReward(msg.sender) {
        require(amount != 0, "Cannot stake 0");
        super.stake(amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public override updateReward(msg.sender) {
        require(amount != 0, "Cannot withdraw 0");
        super.withdraw(amount);
        emit Withdrawn(msg.sender, amount);
    }

    function exit() external {
        withdraw(balanceOf(msg.sender));
        getReward();
        claim();
    }

    function getReward() public updateReward(msg.sender) {
        uint256 reward = earned(msg.sender);
        if (reward != 0) {
            rewards[msg.sender] = 0;
            Y3D.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    // Todo(minakokojima): manager should be a contract, automatic buy in and burn Y3D.
    function change_crv_manager(address new_manager) public {
        require(msg.sender == crv_manager, 'only current manager');
        crv_manager = new_manager;
    }

    function invest() public {
        ICrvDeposit(crv_deposit).deposit(LPT.balanceOf(address(this)));
    }

    function harvest() public {
        ICrvMinter(crv_minter).mint(crv_deposit);
        CRV.transfer(crv_manager, CRV.balanceOf(address(this)));
    }

    function theExodus() public {
        require(msg.sender == crv_manager, 'only current manager');
        exodus = !exodus;
    }

    /**
     * @dev This function must be triggered by the contribution token approve-and-call fallback.
     *      It will update reward rate and time.
     * @param _amount Amount of reward tokens added to the pool
     */
    function receiveApproval(uint256 _amount) external updateReward(address(0)) {
        require(_amount != 0, "Cannot approve 0");

        if (block.timestamp >= periodFinish) {
            rewardRate = _amount.div(DURATION);
        } else {
            uint256 remaining = periodFinish.sub(block.timestamp);
            uint256 leftover = remaining.mul(rewardRate);
            rewardRate = _amount.add(leftover).div(DURATION);
        }
        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(DURATION);

        Y3D.safeTransferFrom(msg.sender, address(this), _amount);
        emit RewardAdded(_amount);
    }
}