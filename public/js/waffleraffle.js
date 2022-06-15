///const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/daf7719fd4344cf388994c9b4b53caba"));

//const { default: Web3 } = require("web3");
const deployedAddress = '0xBd79C34c58D54bF435B9fddC10eDFB123FE7515B';


var WaffleContract;

const abi = JSON.parse('[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_depositer","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"LogDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_winner","type":"address"}],"name":"LogDraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"LogFallback","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_register","type":"address"}],"name":"LogRegistration","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_purchaser","type":"address"},{"indexed":false,"internalType":"uint256","name":"_tickets","type":"uint256"}],"name":"LogTicketPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_withdrawer","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"LogWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"name":"conversionRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"draw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"prizeLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"registered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"ticketsSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"winner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"stateMutability":"payable","type":"receive","payable":true},{"inputs":[],"name":"getIsRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"registerWallet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function","payable":true},{"inputs":[{"internalType":"uint256","name":"_withdrawAmount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"buyTickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fullDraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tickets","type":"uint256"}],"name":"changeRaffleStatsTickets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_prizeLimit","type":"uint256"}],"name":"changeRaffleStatsPrizeLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newRate","type":"uint256"}],"name":"changeRaffleStatsConversionRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"refundTicketHolders","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}]');
//web3 = new Web3(window.ethereum);
WaffleContract = new web3.eth.Contract(abi, deployedAddress);

window.addEventListener('load', async () => {

    checkMetaMaskInstalled();
    connectToMetaMask();

    WaffleContract.setProvider(window.ethereum);

    window.ethereum.on('accountsChanged', function(accounts) {
        console.log('accountsChanges', accounts);
        // change wallet in top right
        changeWalletAddress();
        location.reload();
    })
   
})


function checkMetaMaskInstalled() {
    if (typeof window.ethereum !== 'undefined') {
        console.log("🦊 MetaMask is installed! 🦊");
    }
}

async function checkNetwork () {
    let networkID = await ethereum.request({method: 'eth_chainId'});
    if (networkID !== '0x3') {
        window.alert("Please switch networks to Ropsten");
    }
    await ethereum.request({method: 'wallet_switchEthereumChain', params: [{chainId: '0x3'}]
        });
}

async function connectToMetaMask () {
    await ethereum.request({method: 'eth_requestAccounts'});
    changeWalletAddress();
    await checkNetwork();
}

function changeWalletAddress () {
    const mmCurrentAccount = document.getElementById('mm-connect');
    mmCurrentAccount.innerHTML = String(ethereum.selectedAddress).substring(0, 6)
    + "..." +
    String(ethereum.selectedAddress).substring(38);
    window.userAddress = ethereum.selectedAddress;
}

async function checkIfMetaMaskIsInstalled () {
    if (typeof window.ethereum !== 'undefined') {
        console.log("🦊 MetaMask is installed! 🦊");
        let mmDetected = document.getElementById('mm-detected');
        mmDetected.innerHTML = "<div class='alert alert-success' role='alert'>🦊 MetaMask has been detected!</div>";
    } else {
        alert("You need to install MetaMask");
        let mmDetected = document.getElementById('mm-detected');
        mmDetected.innerHTML = "🦊 MetaMask is not installed! 🚫";
        console.log("🦊 MetaMask is not installed! 🚫")
    }
}

const mmEnable = document.getElementById('mm-connect');
mmEnable.onclick = async () => {
    connectToMetaMask();
}

/*~~~Registration~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const registerWallet = document.getElementById('register-wallet');
registerWallet.onclick = async () => {

    await window.WaffleContract.methods.registerWallet().send({from: ethereum.selectedAddress}).then(console.log);

    location.reload();
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*~~~Deposit~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const depositAmount = document.getElementById('deposit-amount');
const ssSubmit = document.getElementById('ss-input-button');

ssSubmit.onclick = async () => {
    const ssValue = (document.getElementById('ss-input-box').value) * 10**18;
    console.log("Ξ Deposited: " + ssValue);

    await WaffleContract.methods.deposit().send({
        from: ethereum.selectedAddress,
        value: ssValue
    });

    location.reload();
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*~~~Withdraw~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const withdrawAmount = document.getElementById('withdraw-amount');
const wwWithdraw = document.getElementById('withdraw-button');

wwWithdraw.onclick = async () => {
    const wwValue = ((document.getElementById('withdraw-amount').value) * 10**18).toString();
    console.log("Ξ Withdraw Requested: " + wwValue);

    await WaffleContract.methods.withdraw(wwValue).send({
        from: ethereum.selectedAddress
    });

    location.reload();
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*~~~Ticket purchase~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const ticketPurchaseAmount = document.getElementById('ticket-purchase-amount');
const ticketPurchase = document.getElementById('ticket-purchase-button');

ticketPurchase.onclick = async () => {
    const ticketPurchaseValue = document.getElementById('ticket-purchase-amount').value;
    console.log("Ξ Ticket Purchase Requested: " + ticketPurchaseValue);

    await WaffleContract.methods.buyTickets(ticketPurchaseValue).send({
        from: ethereum.selectedAddress,
        gas: 5000000
    });

    const ret_val = remainingTicketsResult().then(tickets => {
        let tix = tickets.toString();
        document.getElementById('tickets-remaining').innerHTML = tix + " / 1000";

    })

    location.reload();
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*~~~Tickets remaining~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const remainingTicketsResult = async () => {
    const tickets = await WaffleContract.methods.ticketsSold().call();

    if (tickets >= 500) {
        const drawWinner = document.getElementById('draw-winner');
        drawWinner.innerHTML = "<h2><style='size:30px;'>You can now draw a winner</h2><button id='draw-button' class='button-75' style='background-color:#69F0AE; margin: 15px;'>Draw Winner</button>";
    
        const drawButton = document.getElementById('draw-button');

        drawButton.onclick = async () => {
  
            let account = await ethereum.request({ method: 'eth_accounts' });
            await WaffleContract.methods.fullDraw().send({ from: account[0] });

            let winner = await WaffleContract.methods.winner().call()
            let winnerString = winner.toString();

            drawWinner.innerHTML = "Draw Complete<br><h2>The winner won " + (tickets * 0.002) + " ETH</h2>"
            drawButton.innerHTML = null;


            setTimeout(function() {
                window.location.reload(1);
            }, 8000)
        }
    }
    return tickets;
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


const getEthereumAccount = async() => {
    let account = await ethereum.request({ method: 'eth_accounts' });
    return account
}

const checkIsRegistered = async(account) => {

    let regCheck = await WaffleContract.methods.getIsRegistered().call({from: account[0]});
    return regCheck

}

/*~~~Return user balances~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const userBalanceCurrent = document.getElementById('user-balance');
const userBalances = async(regCheck, account) => {

    if (regCheck) {
        console.log("Wallet is registered!");

        let accountBalance = await WaffleContract.methods.getBalance().call({from: account[0]});

        let registerButton = document.getElementById('register-wallet')
        registerButton.innerHTML = "Wallet Registered";

        userBalanceCurrent.innerHTML = (accountBalance / 10**18) + " ETH";
    } else {
        console.log("Wallet is not registered!")

        userBalanceCurrent.innerHTML = "0 ETH"
    }
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const userTickets = async (account) => {
    const userTickets = await WaffleContract.methods.getTickets().call({from : account[0]})
    return userTickets
}

const drawNumber = document.getElementById('draw-number');
const drawNumberDisplay = async () => {
    let drawNumberFetch = await WaffleContract.methods.draw().call();
    drawNumber.innerHTML = drawNumberFetch.toString();
}

/*~~~Return current prize~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const currentPrize = document.getElementById('current-prize');
const currenPrizeCalc = async () => {
    let ticketsSoldFetch = await WaffleContract.methods.ticketsSold().call();
    currentPrize.innerHTML = (ticketsSoldFetch * 0.002).toString() + " ETH";
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*~~~Check winner~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const checkWinner = async () => {

    let currentDraw = await WaffleContract.methods.draw().call();

    if (currentDraw > 0) {
        let currentWinner = await WaffleContract.methods.winner().call();
        let displayWinner = document.getElementById('display-winner');
    
        if (currentWinner.toString() != '0x0000000000000000000000000000000000000000') {
    
            if (currentWinner.toString() == String(ethereum.selectedAddress)) {
                displayWinner.innerHTML = "Congratulations, you won the previous draw!";
            } else {
                displayWinner.innerHTML = "<div class='Winner-box'><h3><b>Draw " + (currentDraw - 1) + " Winner: </b>" + 
                    String(currentWinner).substring(0, 6) 
                    + "..."
                    + String(currentWinner).substring(38); 
                    + "</h3></div>";
            }
        }  
    }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

$(document).ready(function() {

    getEthereumAccount().then((account) => {
        checkIsRegistered(account).then((regCheck) => {
            userBalances(regCheck, account);
        }).then(
            userTickets(account).then(userTickets => {
                let userTix = userTickets.toString();
                document.getElementById('user-tickets').innerHTML = userTix
            })
        )
    })

    remainingTicketsResult().then(tickets => {
        let tix = tickets.toString();
        document.getElementById('tickets-remaining').innerHTML = tix + " / 1000";

    })

    drawNumberDisplay();
    currenPrizeCalc();
    checkWinner();
   
})

