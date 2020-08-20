pragma solidity ^0.5.0;
import './y3dPool.sol';
import './y3dToken.sol';

interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

contract y3dFactory {
    y3dToken public y3d;
    y3dPool public mkrPool;
    y3dPool public compPool;
    y3dPool public linkPool;
    y3dPool public wethPool;
    y3dPool public snxPool;
    y3dPool public lendPool;
    y3dPool public yfiPool;
    y3dPool public yfiiPool;    
    y3dPool public wbtcPool;
    y3dPool public uniswapPool;
    address public uniswap;
    IUniswapV2Factory public uniswapFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);

    constructor() public {
        y3d = new y3dToken(address(this));
    }

    function initWETH() public {
        require(address(wethPool) == address(0), "Already initialized");
//        wethPool = new y3dPool(address(y3d), 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2, 7 days, now + 24 hours);
        wethPool = new y3dPool(address(y3d), 0xc778417E063141139Fce010982780140Aa0cD5Ab, 7 days, now);        
        wethPool.setRewardDistribution(address(this));
        y3d.transfer(address(wethPool), 1000000000000000000000000);
        wethPool.notifyRewardAmount(y3d.balanceOf(address(wethPool)));
        wethPool.setRewardDistribution(address(0));
        wethPool.renounceOwnership();
    }

    function initUNI() public {
        require(address(uniswapPool) == address(0), "Already initialized");
        uniswap = uniswapFactory.createPair(0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c, address(y3d));
        uniswapPool = new y3dPool(address(y3d), uniswap, 21 days, now);
        uniswapPool.setRewardDistribution(address(this));
        y3d.transfer(address(uniswapPool), 7000000000000000000000000);
        uniswapPool.notifyRewardAmount(y3d.balanceOf(address(uniswapPool)));
        uniswapPool.setRewardDistribution(address(0));
        uniswapPool.renounceOwnership();
    }    

}
