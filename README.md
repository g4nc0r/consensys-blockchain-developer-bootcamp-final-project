# WaffleRaffle

![front end screennshot](https://github.com/g4nc0r/consensys-blockchain-developer-bootcamp-final-project/blob/404f38592b9e20510d4c320b66b9ac22d197fa9b/public/images/frontend-screenshot.png?raw=true)

## Description

This project is a raffle-like game of chance. 

The idea for this project was inspired by the no-loss lottery project PoolTogether. When using PoolTogether, a user deposits a cryptocurrency token or stablecoin into a pool and in return receives tickets representing the value of their deposit into the pool. The pool is then taken and used to earn interest in various interest bearing applications such as providing liquidiy. This interest is then used as a prize which is paid out to a ticket holder. 

PoolTogether requires a decent sized pool of depositors in order to facilitate an interest amount that is worthy as a prize. My idea for this project is simpler and more akin to a normal raffle. In this project, all of the proceeds generated from ticket purchases is paid out to the winning ticket holder. 

### Workflow

1. User registers their wallet address to the smart contract
2. User can then deposit Ether into the smart contract which is allocated to a balance associated with their wallet
3. Ether deposited onto the smart contract can be used to purchase raffle tickets
4. Once the minimum amount of raffle tickets has been purchased, a prize draw can be called
5. A winner is selected by generating a pseudo-random number and using this to select a winning ticket
6. The prize amount - which is the pooled value of tickets purchased, is credited to the winner's balance
7. The winner can then withdraw this amount in Ether to their wallet
8. Ticket values are reset and a new draw can be commenced

### Frontend

+ https://g4nc0r.github.io/consensys-blockchain-developer-bootcamp-final-project/

## Considerations

### Pseudo-Random Number Generation

+ A pseudo-random number is used in this contract to generate a number which is used to select a winning ticket. I have used this for the purposes of this project, however a better solution would be to generate a truly random number using a service such as Chainlink VRF. This is something I may come back to at a future date and implement. 

### Automating The Contract

+ In its current form, the contract requires a user to manually call the draw function to select a winner. Ideally this would be replaced with a service such as Chainlink Keepers to automated the draw function by checking if either a minimum number of tickets have been sold, or a certain amount of time has passed since the block that the draw began. 

## Directory Structure

```sh
├ contracts         - smart contracts
├ test              - smart contract unit tests

├ public            - static frontend folders
├─ public/css        - stylesheet for frontend
├─ public/images     - static images for frontend
├─ public/js         - scripts for frontend
```

## Problems & Unknowns

- Limits amounts on deposits, threshold, time, withdrawals
- Gas fees for transfers – need to be optimised

## Prerequisites

- Node
- Truffle
- Solidity
- Metamask wallet connected to Ropsten

### Initial Setup

```bash
$ npm install -g truffle
```

```bash
$ npm install @openzeppelin/contracts
```

### Run Smart Contract Tests

* development network is configured on port 8545

```bash
$ ganache-cli -p 8545

$ truffle test
```

## Consensys NFT Certificate

![NFT cert](https://openseauserdata.com/files/a6c8933ad3983aa52c310f957638b706.svg)
- [Link to NFT Certificate](https://etherscan.io/nft/0x1975fbcf98b5678db232c8d2c78fb574fab14d73/275)
