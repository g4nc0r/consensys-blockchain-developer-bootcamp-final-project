const WaffleRaffle = artifacts.require("WaffleRaffle");

const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("WaffleRaffle", function (accounts) {

  let owner = accounts[0];
  let user = accounts[1];
  let nonuser = accounts[2];

  beforeEach(async () => {
    instance = await WaffleRaffle.new();
    instanceAddress = instance.address;
  });

  describe("Constructor", () => {
    /*=============================================================================
        Test 1 - Contract address
    =============================================================================*/
    it("raffle contract should have an address", async () => {
      assert.notEqual(instanceAddress, 0x0);
      assert.notEqual(instanceAddress, null);
      assert.notEqual(instanceAddress, undefined);
    });
    /*=============================================================================
        Test 2 - Initial ticket number
    =============================================================================*/
    it("tickets initial value is set to 1000", async () => {
      assert(await instance.tickets(), 1000);
    });
    /*=============================================================================
        Test 3 - Initial deposit limit
    =============================================================================*/
    it("prize limit initial value is set to 10 Ether", async () => {
      assert(
        await instance.prizeLimit(), 
        web3.utils.toWei(web3.utils.toBN(10), "ether")
      );
    });
  });

  describe("Registration", () => {
    /*=============================================================================
        Test 4 - Wallet registration
    =============================================================================*/
    it("a wallet can register with the smart contract", async () => {
      assert(await instance.registerWallet(), user);
    });
    /*=============================================================================
        Test 5 - Check wallet registration
    =============================================================================*/
    it("a user can see if their wallet is already registered", async () => {
      await instance.registerWallet();
      assert(await instance.getIsRegistered(), true);
    });
  });

  describe("Deposit & Withdrawl", () => {
    /*=============================================================================
        Test 6 - Unregistered wallet deposit
    =============================================================================*/
    it("an unregistered wallet cannot deposit to the contract", async () => {
    
      await truffleAssert.reverts(instance.deposit.sendTransaction({
        from: nonuser,
        to: instance.address, 
        value: 1}),
        "revert");
  
      });
    /*=============================================================================
        Test 7 - Registered wallet deposit
    =============================================================================*/
    it("a registered user can deposit Ether into the smart contract", async () => {
      await instance.registerWallet();

      let options = {
        from: owner,
        to: instance.address,
        value: web3.utils.toWei('1', "ether")
      }
      
      await instance.deposit.sendTransaction(options);

      let depositedBalance = await instance.getBalance();
      let testBalance = web3.utils.toWei('1', "ether")
      
      assert.equal(depositedBalance, testBalance);
    });
  
    /*=============================================================================
        Test 8 - Withdrawl 
    =============================================================================*/
    it("a registered user can withdraw Ether out of the smart contract", async () => {
      await instance.registerWallet();

      let options = {
        from: owner,
        to: instance.address,
        value: web3.utils.toWei('1', "ether")
      }

      await instance.deposit.sendTransaction(options);
      assert.equal(
        await instance.getBalance(),
        web3.utils.toWei('1',"ether")
        );

      await instance.withdraw(web3.utils.toWei('1', "ether"));
      assert.equal(
        await instance.getBalance(),
        0
        );
    });
  })
  describe("Tickets", async () => {
    /*=============================================================================
        Test 9 - Ticket purchase
    =============================================================================*/
    it("tickets can be purchased by a registered wallet with funds deposited", async () => {
      await instance.registerWallet({from: user});
      
      let options = {
        from: user,
        to: instance.address,
        value: web3.utils.toWei('1', "ether")
      }

      await instance.deposit.sendTransaction(options);

      await instance.buyTickets(2, {from: user});
      const ticketsBought = await instance.getTickets({from: user});

      assert.equal(2, ticketsBought);
    });
    /*=============================================================================
        Test 10 - Ticket purchase limit
    =============================================================================*/
    it("there cannot be more tickets purchased than the individual player limit", async () => {
      await instance.registerWallet({from: user});

      let options = {
        from: user,
        to: instance.address,
        value: web3.utils.toWei('10', "ether")
      }

      await instance.deposit.sendTransaction(options);

      await truffleAssert.reverts(
        instance.buyTickets(201, {from: user, gas: 5000000}),
        "revert"
      )
      
    });
  });
    describe("Access Control", async () => {
    /*=============================================================================
        Test 11 - Testing access cntrol
    =============================================================================*/
      it("only contract owner can change the state variables", async () => {
        
        await instance.changeRaffleStatsTickets(2000);
        let ticketsNumber = await instance.tickets();
        assert.equal(2000, ticketsNumber);
        
        await truffleAssert.reverts(
          instance.changeRaffleStatsPrizeLimit(web3.utils.toWei('5', "ether"), {from: user}),
          "revert"
        )
      });
  });
  
});

