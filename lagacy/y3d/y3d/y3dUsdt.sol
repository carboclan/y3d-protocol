pragma solidity ^0.5.17;

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

import './libraries/SafeMath.sol';
import './interfaces/IERC20.sol';
import './interfaces/IyToken.sol';

pragma solidity ^0.6.0;

contract Context {
    constructor () internal { }
    // solhint-disable-previous-line no-empty-blocks

    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

contract ERC20 is Context, IERC20 {
    using SafeMath for uint256;

    mapping (address => uint256) _balances;

    mapping (address => mapping (address => uint256)) private _allowances;

    uint256 _totalSupply;
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }
    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }
    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }
    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _balances[sender] = _balances[sender].sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }
    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: burn from the zero address");

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    function _burnFrom(address account, uint256 amount) internal {
        _burn(account, amount);
        _approve(account, _msgSender(), _allowances[account][_msgSender()].sub(amount, "ERC20: burn amount exceeds allowance"));
    }
}

contract ERC20Detailed is ERC20 {
    string constant private _name = "y3dUsdt";
    string constant private _symbol = "y3dUsdt";
    uint8 constant private _decimals = 18;

    function name() public pure returns (string memory) {
        return _name;
    }
    function symbol() public pure returns (string memory) {
        return _symbol;
    }
    function decimals() public pure returns (uint8) {
        return _decimals;
    }
}

contract y3d_usdt is ERC20Detailed {

    address constant public uT = address(0xdAC17F958D2ee523a2206206994597C13D831ec7); // usdt, underlying token
    address constant public yT = address(0x83f798e925BcD4017Eb265844FDDAbb448f1707D); // yUsdt, yToken
    uint save = 1;                                                                    // How many token are saving. = 1 to avoid / 0 error.
    function b() public view returns (uint) {
        IERC20 u = IERC20(uT);
        return u.balanceOf(address(this)) + save;
    }
    function stake(uint amount) external {
        IERC20 u = IERC20(uT);
        u.transferFrom(msg.sender, address(this), amount);
        uint share = amount.mul(totalSupply()).div(b()); 
        _mint(msg.sender, share);
    }
    function unstake(uint share) external {
        IERC20 u = IERC20(uT);
        uint amount = share.mul(b()).div(totalSupply());
        _burn(msg.sender, share);
        amount = amount - amount/20;
        if (amount > u.balanceOf(address(this))) withdraw();
        u.transfer(msg.sender, amount);
    }
    function deposit(uint amount) public { 
        IyToken y = IyToken(yT);
        y.deposit(amount);
        save = save.add(amount);
    }
    function depositAll() public {
        IERC20 u = IERC20(uT);
        deposit(u.balanceOf(address(this)));
    }
    function withdraw() public {
        IyToken y = IyToken(yT);
        y.withdraw(y.balanceOf(address(this)));
        save = 1;
    }
}