// Dependency file: @openzeppelin/contracts/token/ERC20/IERC20.sol



// pragma solidity ^0.6.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * // importANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


// Dependency file: @openzeppelin/contracts/math/SafeMath.sol



// pragma solidity ^0.6.0;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}


// Dependency file: src/IyDeposit.sol


// pragma solidity >=0.4.21 <0.7.0;

interface IyDeposit {
  function add_liquidity ( uint256[4] calldata uamounts, uint256 min_mint_amount ) external;
  // Not using functions below, just uncomment what you wants to use
//   function remove_liquidity ( uint256 _amount, uint256[4] calldata min_uamounts ) external;
//   function remove_liquidity_imbalance ( uint256[4] calldata uamounts, uint256 max_burn_amount ) external;
//   function calc_withdraw_one_coin ( uint256 _token_amount, int128 i ) external returns ( uint256 );
//   function remove_liquidity_one_coin ( uint256 _token_amount, int128 i, uint256 min_uamount ) external;
//   function remove_liquidity_one_coin ( uint256 _token_amount, int128 i, uint256 min_uamount, bool donate_dust ) external;
//   function withdraw_donated_dust (  ) external;
//   function coins ( int128 arg0 ) external returns ( address );
//   function underlying_coins ( int128 arg0 ) external returns ( address );
//   function curve() external returns ( address );
//   function token() external returns ( address );
}


// Dependency file: src/IUSDT.sol


// pragma solidity >=0.4.21 <0.7.0;

// Because USDT is not so standard ERC20, we just use their code as interface
interface IUSDT {
    function transfer(address _to, uint _value) external;
    function transferFrom(address _from, address _to, uint _value) external;
    function balanceOf(address who) external view returns (uint);
    function approve(address _spender, uint _value) external;
    function allowance(address _owner, address _spender) external view returns (uint remaining);
}

// Dependency file: src/IyswUSD.sol



// pragma solidity ^0.6.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IyswUSD {

    function stake(uint256 _amount) external;
    function unstake(uint256 _shares) external;

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * // importANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


// Root file: src/UnitedMint.sol


pragma solidity >=0.4.21 <0.7.0;
// only use ABIEncoderV2 to return rich data, no worry
// pragma experimental ABIEncoderV2;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/math/SafeMath.sol";
// import "src/IyDeposit.sol";
// import "src/IUSDT.sol";
// import "src/IyswUSD.sol";

/**
 * UniMint - Crowdfunding USDT to print swUSD together
 */

contract UnitedMint {
    using SafeMath for uint;

    address constant public USDT = address(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    address constant public swUSD = address(0x77C6E4a580c0dCE4E5c7a17d0bc077188a83A059);
    address constant public yswUSD = address(0x2b1120F0C8238C098C767282092D49d9ac527e8C);
    address constant public yDeposit = address(0x329239599afB305DA0A2eC69c58F8a6697F9F88d);
  
    mapping(address=>uint) _balance; // unminted USDT

    function setBalance(address who, uint amount) internal {
        _balance[who] = amount;
    }
    function balanceOf(address who) public view returns (uint) {
        return _balance[who];
    }

    uint public mintedUSDT; // USDT involved in minting swUSD

    constructor() public {
       IUSDT(USDT).approve(yDeposit, uint(-1));
       IERC20(swUSD).approve(yswUSD, uint(-1));        
    }

    function unminted_USDT() view public returns (uint) {
        return IERC20(USDT).balanceOf(address(this));
    }    
    function minted_swUSD() view public returns (uint) {
        return IERC20(swUSD).balanceOf(address(this));
    }
    function minted_yswUSD() view public returns (uint) {
        return IERC20(yswUSD).balanceOf(address(this));
    }
    function get_yswUSDFromUsdt(uint amount) public view returns (uint) {
        return amount.mul(minted_yswUSD()).div(mintedUSDT);
    }
    function get_usdtFromyswUSD(uint amount) public view returns (uint) {
        return amount.mul(mintedUSDT).div(minted_yswUSD());
    }    

    event Deposit(address indexed who, uint usdt);
    event Claim(address indexed who, uint usdt, uint yswUSD);
    event Restore(address indexed who, uint yswUSD, uint usdt);

    /**
     * @dev Deposit usdt or claim yswUSD directly if balance of yswUSD is sufficient
     */
    function deposit(uint input) external {
        require(input != 0, "Empty usdt");        
        IUSDT(USDT).transferFrom(msg.sender, address(this), input);
        if (input > mintedUSDT) {
            setBalance(msg.sender, balanceOf(msg.sender).add(input));
            emit Deposit(msg.sender, input);
        } else {
            uint output = get_yswUSDFromUsdt(input);
            mintedUSDT = mintedUSDT.sub(input);
            IERC20(yswUSD).transfer(msg.sender, output);
            emit Claim(msg.sender, input, output);
        }
    }

    /**
     * @dev withdraw unminted USDT
     */
    function withdraw() external {
        uint output = balanceOf(msg.sender);
        setBalance(msg.sender, 0);   
        IUSDT(USDT).transfer(msg.sender, output);
    }

    /**
     * @dev Mint all unminted_USDT into yswUSD
     */
    function mint() public {
        require(unminted_USDT() > 0, "Empty usdt");
        mintedUSDT = mintedUSDT.add(unminted_USDT());
        IyDeposit(yDeposit).add_liquidity([0,0,unminted_USDT(),0], 0);
        IyswUSD(yswUSD).stake(minted_swUSD());
    }

    /**
     * @dev Claim yswUSD back, if the balance is sufficient, execute mint()
     */
    function claim() public {
        uint input = balanceOf(msg.sender);
        require(input != 0, "You don't have USDT balance to withdraw");
        uint r; // requirement swUSD
        if (mintedUSDT == 0) {
            mint();
            r = get_yswUSDFromUsdt(input);
        } else {
            r = get_yswUSDFromUsdt(input);
            if (r > minted_yswUSD()) mint(); 
            r = get_yswUSDFromUsdt(input);
        }
        mintedUSDT = mintedUSDT.sub(input);        
        IERC20(yswUSD).transfer(msg.sender, r);
        setBalance(msg.sender, 0);
        emit Claim(msg.sender, input, r);
    }

    /**
     * @dev Try to claim unminted usdt by yswUSD if the balance is sufficient
     */
    function restore(uint input) external {
        require(input != 0, "Empty yswUSD");
        require(minted_yswUSD() != 0, "No yswUSD price at this moment");
        uint output = get_yswUSDFromUsdt(unminted_USDT());
        if (output < input) input = output;
        output = get_usdtFromyswUSD(input);
        mintedUSDT = mintedUSDT.add(output);
        IERC20(yswUSD).transferFrom(msg.sender, address(this), input);
        IUSDT(USDT).transfer(msg.sender, output);
        emit Restore(msg.sender, input, output);
    }    

    /**
     * @dev Deposit usdt and claim yswUSD in any case
     */
    function depositAndClaim(uint input) external {
        require(input != 0, "Empty usdt");        
        IUSDT(USDT).transferFrom(msg.sender, address(this), input);
        if (input > mintedUSDT) {
            mint();
        }
        uint output = get_yswUSDFromUsdt(input);
        mintedUSDT = mintedUSDT.sub(input);
        IERC20(yswUSD).transfer(msg.sender, output);
        emit Claim(msg.sender, input, output);
    }
}