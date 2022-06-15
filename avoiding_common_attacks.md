# Avoiding Common Attacks

## [SWC-100 - Function Default Visibility](https://swcregistry.io/docs/SWC-100)

Functions that do not have a function visibility type specified are public by default. This can lead to a vulnerability if a developer forgot to set the visibility and a malicious user is able to make unauthorised or unintended state changes.

* All functions in WaffleRaffle.sol have visibility declared explicitly.

## [SWC-108 - State Variable Default Visibility](https://swcregistry.io/docs/SWC-108) 

Labelling the visibility explicitly makes it easier to catch incorrect assumptions about who can access the variable.

* All state variables in WaffleRaffle.sol have visibility declared explicitly.

## [SWC-103 - Floating Pragma](https://swcregistry.io/docs/SWC-103)

Contracts should be deployed with the same compiler version and flags that they have been tested with thoroughly. Locking the pragma helps to ensure that contracts do not accidentally get deployed using, for example, an outdated compiler version that might introduce bugs that affect the contract system negatively.

* Specific pragma used (0.8.0)

### Using Specific Compiler Pragma
* pragma 0.8.0

### Proper Use of Require, Assert and Revert
* Require, assert and revert have been used in WaffleRaffle.sol

### Use Modifiers Only for Validation
* All modifiers in WaffleRaffle.sol are validation only

# Considerations

## [SWC-120 - Weak Sources of Randomness from Chain Attributes](https://swcregistry.io/docs/SWC-120)

I note that this SWC highlights using block attributes to generate pseudo-random numbers can be insecure due to miners having the ability to game the system when applied to gambling DApps. In WaffleRaffle.sol I use the following to generate a pseudo-random number:

    function random() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(draw, block.difficulty, block.timestamp, ticketsSold)));
    }

This uses block attributes combined with state variables to generate a number which is then used to pick a winning ticket. At first I had set the default prize limit per draw to 10 ETH. The current block reward (as per https://etherscan.io/blocks) is roughly 2 ETH. In order to disincentivise miners from gaming the raffle, I decided to reduce the default prize limit to 2 ETH. I would eventually like to add the option where if the prize limit is greater than the block reward, the source of randomness would be obtained off-chain such as from Chainlink VRF. 