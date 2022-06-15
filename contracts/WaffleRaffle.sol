// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

/// @title a raffle game where user buys tickets with ETH for a chance to win pool
/// @author g4nc0r

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract WaffleRaffle is Ownable, Pausable {

/* ========================================================================================
    State variables
==========================================================================================*/

    uint public draw = 0;

    uint public tickets;
    uint public ticketsSold;
    uint public conversionRate; 
    uint public prizeLimit;

    mapping (address => bool) public registered;
    mapping (address => uint) private balances;
    address[] private ticketArray;
    address public winner;
    
    mapping (uint => mapping (address => uint)) ticketsHeld;


/* ========================================================================================
    Modifiers
==========================================================================================*/

    modifier isRegistered(address _register) {
        require (registered[msg.sender], "This wallet is not registered");
        _;
    }

    modifier sufficientBalance(address _caller, uint _amount) {
        require (balances[msg.sender] >= _amount, "Amount exceeds available balance");
        _;
    }

    modifier sufficientTickets(uint _amount) {
        require (tickets >= _amount, "Not enough tickets available");
        _;
    }

    modifier ticketPurchaseLimit(uint _amount) {
        require (_amount <= 200);
        require (getTickets() < 200, "Ticket purchase limit exceeded");
        _;
    }

/* ========================================================================================
    Events
==========================================================================================*/

    event LogRegistration(address _register);

    event LogDeposit(address _depositer, uint _value);

    event LogWithdrawal(address _withdrawer, uint _value);

    event LogTicketPurchase(address _purchaser, uint _tickets);

    event LogFallback(address _sender, uint _value);

    event LogDraw(address _winner);

/* ========================================================================================
    Functions
==========================================================================================*/

    constructor() {
        tickets = 1000;
        prizeLimit = 2 ether; 
        conversionRate = prizeLimit / tickets;
    }

    /*====================================================
        Conversions
    =====================================================*/

    /// @notice Converts Eth amount to equivalent ticket amount using conversion ratio
    /// @param _ethAmount amount of Eth to convert into equivalent tickets
    /// @return
    function ethToTicketConversionRate(uint _ethAmount) private view returns(uint) {
        uint ticketAmount = _ethAmount * conversionRate;
        return ticketAmount;
    }

    /// @notice Converts ticket amount to equivaqlent Eth amount using conversion ratio
    /// @param _ticketAmount amount of tickets to convert to equivalent Eth amount
    /// @return
    function ticketToEthConversionRate(uint _ticketAmount) private view returns(uint) {
        uint ethAmount = _ticketAmount * conversionRate;
        return ethAmount;
    }

    /*====================================================
        Getters
    =====================================================*/

    /// @notice Checks if the current user's wallet is registered
    /// @return Returns bool, true if registered, false if not registered
    function getIsRegistered() public view returns(bool) {
        return registered[msg.sender];
    }

    /// @notice Retrieves the Eth balance in the smart contract of a wallet
    /// @return Returns the Eth balance in the smart contract of a wallet 
    function getBalance() isRegistered(msg.sender) public view returns(uint) {
        return balances[msg.sender];
    }

    /// @notice Retrieves the ticket balance of the caller
    /// @return Returns ticket balance of the caller
    function getTickets() isRegistered(msg.sender) public view returns(uint) {
        return ticketsHeld[draw][msg.sender];
    }

    /*====================================================
        Registration, deposit & withdrawl
    =====================================================*/

    /// @notice Registers a wallet to 'registered' mapping
    /// @return Returns true once wallet is registered
    function registerWallet() public returns(bool) {
        require(registered[msg.sender] != true, "This wallet is already registered");
        registered[msg.sender] = true;
        emit LogRegistration(msg.sender);
        return registered[msg.sender];
    }
    
    /// @notice Allows reistered wallets to deposit Eth to the smart contract
    /// @return Returns balance of sender's wallet
    function deposit() public payable isRegistered(msg.sender) returns(uint) {
        //require(address(this).balance <= depositLimit, "Deposits exceeded for this draw");
        balances[msg.sender] += msg.value;
        emit LogDeposit(msg.sender, msg.value);
        return balances[msg.sender];
    }

    /// @notice Allows registered wallets with sufficient balance to withdraw Eth deposited
    /// @param _withdrawAmount Amount in Eth to withdraw from the smart contract
    /// @return Returns balance of sender's wallet
    function withdraw(uint _withdrawAmount) public 
        isRegistered(msg.sender) 
        sufficientBalance(msg.sender, _withdrawAmount) returns(uint) {
            payable(msg.sender).transfer(_withdrawAmount);
            balances[msg.sender] -= _withdrawAmount;
            emit LogWithdrawal(msg.sender, _withdrawAmount);
            return balances[msg.sender];
    }

    /*====================================================
        Tickets
    =====================================================*/

    /// @notice Buys tickets using balance available
    /// @param _amount Number of tickets 
    /// @return Returns number of tickets held after purchase
    function buyTickets(uint _amount) public 
        isRegistered(msg.sender) 
        sufficientBalance(msg.sender, _amount) 
        sufficientTickets(_amount) 
        ticketPurchaseLimit(_amount) returns(uint) {
            require(tickets >= _amount, "Tickets have sold out for this draw!");      
            
            tickets -= _amount;  
            ticketsHeld[draw][msg.sender] += _amount;
            balances[msg.sender] -= _amount * conversionRate;
            allocateTickets(_amount);
            ticketsSold += _amount;
            
            emit LogTicketPurchase(msg.sender, _amount);
            return ticketsHeld[draw][msg.sender];
    }

    /// @notice Allocates tickets to an address
    /// @param _amount The amount of tickets 
    function allocateTickets(uint _amount) private {
        for (uint i=0; i < _amount; i++) {
            ticketArray.push(address(msg.sender));
        }
    }

    /*====================================================
        Raffle draw
    =====================================================*/

    /// @notice Produces a pseudorandom number
    /// @return Returns a pseudorandom number 
    function random() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(draw, block.difficulty, block.timestamp, ticketsSold)));
    }

    /// @notice Pays winner of draw the prize amount
    /// @param _winner Address of the winner of the draw
    /// @return Returns prize amount paid to winner
    function payWinner(address _winner) private returns(uint){
        uint prize = ticketToEthConversionRate(ticketsSold);
        balances[_winner] += prize;
        return prize;
    }

    /// @notice Draws a random ticket number, assigns the address of that number as the winner, pays the winner, 
    /// empties the ticket array and then resets the tickets variables and iterates draw to the next draw number
    function fullDraw() whenNotPaused() public {
        require(ticketsSold >= 500);
        
        uint winningTicket = random() % ticketsSold;
        address _winner = ticketArray[winningTicket];
        winner = _winner;
        payWinner(_winner);
        
        for (uint i=0; i < ticketsSold; i++) {
            ticketArray.pop();
        }
        
        tickets = 1000;
        ticketsSold = 0;

        draw += 1;
        emit LogDraw(_winner);
    }

    /*====================================================
        Administration
    =====================================================*/

    /// @notice Changes number of tickets in a draw
    function changeRaffleStatsTickets(uint _tickets) public onlyOwner {
        tickets = _tickets;
    }

    /// @notice Changes the maximum prize limit in a draw
    function changeRaffleStatsPrizeLimit (uint _prizeLimit) public onlyOwner {
        prizeLimit = _prizeLimit;
    }

    /// @notice Changes the individual ticket price
    function changeRaffleStatsConversionRate (uint _newRate) public onlyOwner {
        conversionRate = _newRate;
    }

    /// @notice Refunds ticket holders' balances for tickets purchased
    function refundTicketHolders() whenPaused() onlyOwner public {
        // to implement
    } 

    /// @notice Pause contract calling _pause function in Pausable.sol
    function pause() public onlyOwner {
        _pause();
    }

    /// @notice Unpause contract calling _pause function in Pausable.sol
    function unpause() public onlyOwner {
        _unpause();
    }

    /*====================================================
        Fallback
    =====================================================*/

    receive() payable isRegistered(msg.sender) external {
        balances[msg.sender] += msg.value;
        emit LogDeposit(msg.sender, msg.value);
    }
    fallback() external {
        require (msg.data.length == 0);
        revert("This wallet is not registered");
    }
}