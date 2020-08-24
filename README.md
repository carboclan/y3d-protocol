#  ♨️ Y3D Protocol ♨️

## TL;DR:

Y3D = [YAM](https://yam.finance) + [P3D](https://powh.io)

## DEMO
[https://y3d.netlify.app/](https://y3d.netlify.app/)

## Prequel 

Liquidity token holder is the Prometheus of the DeFi economy, they take the risk of [impermanent loss](https://medium.com/@pintail/uniswap-a-good-deal-for-liquidity-providers-104c0b6816f2), there will be no DeFi logos today without their help. In order to reward those who take the risk, we proposal a new protocol to reward all LP token holders, and by the way, we make the underlying market more liquid by make the liquidity token less liquid. ;)

## How it works?

We keep the Yield Farming part(which we all like it) in Yam and introduce POWH algorithm into liquidity mining. **There will be an additional 5% fees each time when people withdraw their LP token, which will be divide to all other liquidity miner as their POLH(Proof-of-Long-time-Liquidity-Holder).**

## The Distribution

The y3d token itself which is completely useless. There is no governance, no premine, no dev fees, and no audit as well. Mining it at your own risk.

There will be 21,000 y3d token in total. We will carefully select some pools on uniswap at this moment to distribute them. Stay tuned.

- [(News) yCrv Pool, 1,000 y3d in 30 days, start at, Tuesday, August 25, 2020 at 7:00:00 pm](https://twitter.com/Y3dScam/status/1297933387202613251)


## Attributions
Much of this codebase is modified from existing works, including:
- [YAM](https://yam.finance)
- [P3D](https://powh.io)


## FAQ

- How much will i lose at most?

You will lose 5% of your LP token if you jump in and go out immediately.

- What am I going to win?

You are going to mining our y3d token and might win other LP token once another player exit the scam before you.

- Will I lose the transaction fee during staking?

No you won't since you will get 95% of your LP token(and many else) back after exit the scam.

## Develop

### Installation

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
- [y3dPool Contract Diff](https://gist.github.com/lychees/8cf40410871e98438080963913302a83/revisions)

```shell
truffle deploy --network rinkeby
```
