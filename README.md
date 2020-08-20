#  ♨️ Y3D Protocol ♨️

## TL;DR:

Y3D = [YAM](https://yam.finance) + [P3D](https://powh.io)

## DEMO
[https://y3d.netlify.app/](https://y3d.netlify.app/)

## Prequel 

Liquidity token holder is the Prometheus of the DeFi economy, they take the risk of [impermanent loss](https://medium.com/@pintail/uniswap-a-good-deal-for-liquidity-providers-104c0b6816f2), there will be no DeFi logos today without their help. In order to reward those who take the risk, we proposal a new protocol to reward all LP token holders, and by the way, we make the underlying market more liquid by make the liquidity token less liquid. ;)

## How it works?

We keep the Yeild Farming part(which we all like it) in Yam and introduce POWH algorithm into liquidity mining. **There will be an additional 5% fees each time when people withdraw their LP token, which will be divide to all other liquidity miner as their POLH(Proof-of-Long-time-Liquidity-Holder).**

## The Distribution

The y3d token itself which is completely useless. There is no governance, no premine, no dev fees, and no audit as well. Mining it at your own risk. We will selected some pools on uniswap at this moment to distribute them. Stay tuned.

## Attributions
Much of this codebase is modified from existing works, including:
- [YAM](https://yam.finance)
- [P3D](https://powh.io)

## Installation

**ATTENTION**: If you are using macOS Catalina or above, plase install [node-gyp](https://github.com/nodejs/node-gyp) v7+ and set environment variable, read [Installation notes for macOS Catalina (v10.15)](https://github.com/nodejs/node-gyp/blob/master/macOS_Catalina.md) for more details.

1. Install [ganache-cli](https://github.com/trufflesuite/ganache-cli):

```shell
npm install -g ganache-cli
```

1. Install dependencies:

```shell
npm install
```

### FE
```shell
cd www
python -m http.server --cgi 8000
```

### Contract
```shell
truffle deploy --network rinkeby
```
