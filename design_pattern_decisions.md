# Design Pattern Decisions

## Inheritance and Interfaces

* *Pausable.sol*

    import "@openzeppelin/contracts/security/Pausable.sol";

Included for the ability to stop the contract from drawing winners or paying prizes. Also used for function to refund ticket purchases when paused in the event of a contract failure.  

* *SafeMath.Sol*

 I initially used SafeMath.sol, however since Solidity 0.8.0 and above has built in overflow checking with the compiler so I decided to remove it from my contract. The potential benefits would have been some gas savings with iterations or use of '**' operator, however that is not applicable in this instance. 

## Access Control 

* *Ownable.sol*

    import "@openzeppelin/contracts/access/Ownable.sol";

All functions relating to changing parameters of the raffle, such as number of tickets available, the prize limit and the ticket cost have been restricted to the owner of the contract with the *onlyOwner* modifier. 

