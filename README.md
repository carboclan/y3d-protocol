![Node.js CI](https://github.com/edmondhonda/y3d-protocol/workflows/Node.js%20CI/badge.svg)
#  :satellite: Y3D Protocol :satellite:

## TL;DR:

Y3D = [YAM](https://yam.finance) + [P3D](https://powh.io)

## How it works?

We add POWH algorithm into liquidity mining. 
Unlike the origin POWH algorithm, there is no fee when stake, but when weak hand decided to unstake their LP token, there will be an additional 5% fees which will be divide to all other miner as their POSH.

## Attributions
Much of this codebase is modified from existing works, including:
- [YAM](https://yam.finance) - Yes, we fixed [the bug](https://medium.com/@yamfinance/save-yam-245598d81cec).
- [P3D](https://powh.io) - The best ethereum contract ever.

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
