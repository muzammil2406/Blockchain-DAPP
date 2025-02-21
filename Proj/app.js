const contractAddress = '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B';
const contractABI = [
    
    [
        {
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "Deposit",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "Withdrawal",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "getBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "getTransaction",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "transactionCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "transactions",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];

let web3;
let account;
let walletContract;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        alert('MetaMask not detected!');
    }

    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById('account').innerText = account;

    walletContract = new web3.eth.Contract(contractABI, contractAddress);
    updateBalance();
    loadTransactions();
});

async function updateBalance() {
    const balance = await walletContract.methods.getBalance().call();
    document.getElementById('balance').innerText = web3.utils.fromWei(balance, 'ether');
}

async function deposit() {
    const amount = document.getElementById('depositAmount').value;
    await web3.eth.sendTransaction({
        from: account,
        to: contractAddress,
        value: web3.utils.toWei(amount, 'ether')
    });
    updateBalance();
    loadTransactions();
}

async function withdraw() {
    const amount = document.getElementById('withdrawAmount').value;
    await walletContract.methods.withdraw(web3.utils.toWei(amount, 'ether')).send({ from: account });
    updateBalance();
    loadTransactions();
}

async function transfer() {
    const recipient = document.getElementById('transferAddress').value;
    const amount = document.getElementById('transferAmount').value;
    await walletContract.methods.transfer(recipient, web3.utils.toWei(amount, 'ether')).send({ from: account });
    updateBalance();
    loadTransactions();
}

async function loadTransactions() {
    const transactionCount = await walletContract.methods.transactionCount().call();
    const transactionsTable = document.getElementById('transactionsTable');
    transactionsTable.innerHTML = `
        <tr>
            <th>From</th>
            <th>To</th>
            <th>Amount (ETH)</th>
            <th>Timestamp</th>
        </tr>
    `;

    for (let i = 0; i < transactionCount; i++) {
        const transaction = await walletContract.methods.getTransaction(i).call();
        const row = transactionsTable.insertRow();
        const fromCell = row.insertCell(0);
        const toCell = row.insertCell(1);
        const amountCell = row.insertCell(2);
        const timestampCell = row.insertCell(3);

        fromCell.innerText = transaction[0];
        toCell.innerText = transaction[1];
        amountCell.innerText = web3.utils.fromWei(transaction[2], 'ether');
        timestampCell.innerText = new Date(transaction[3] * 1000).toLocaleString();
    }
}