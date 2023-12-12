<script>
    import axios from 'axios';

    async function getTransactions() {

        let transactions = await axios
        .get(`https://customerbackend.azurewebsites.net/getAllTransactions/${localStorage.customer_id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwttoken"),
                'Access-Control-Allow-Origin': '*',
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        })
        return transactions.data;
    }
    let transactions = getTransactions();
</script>

<main>
    <h1>Transactions</h1>
    
    <h3>List of transactions</h3>

    {#if localStorage.jwttoken == undefined || localStorage.jwttoken == null}
        <p>You need to be logged in to view this page</p>
    {:else}
        {#await transactions}
            <h3>Loading transactions...</h3>
        {:then transactions} 
        <button>
            <a href="#/transactions/add">Add new transaction</a>
        </button>

            {#if transactions.length == 0}
                <p>No transactions created</p>
            {:else}
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Transaction</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                        
                    <tbody>
                        {#each transactions as transaction}
                            <tr>
                                <td>{transaction.id}</td>
                                {#if transaction.amount < 0}
                                    <td>{transaction.sender_account_id} have sent money to account ID {transaction.reciever_account_id}</td>
                                {:else if transaction.amount > 0}
                                    <td>{transaction.sender_account_id} have received money from account ID {transaction.reciever_account_id}</td>
                                {:else}
                                    <td>Am I a joke to you? ({transaction.sender_account_id} to {transaction.reciever_account_id})</td>
                                {/if}
                                {#if transaction.amount < 0}
                                    <td style="color:red"> {transaction.amount} </td>
                                {:else if transaction.amount > 0}
                                    <td style="color:green"> {transaction.amount} </td>
                                {:else}
                                    <td> {transaction.amount} </td>
                                {/if}
                                <td>
                                    <a href="#/transactions/edit/{transaction.transaction_id}">Edit</a>
                                    <a href="#/transactions/delete/{transaction.transaction_id}">Delete</a>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
    {/if}
    </main>

    

<style>
    table, th, td {
        border: 1px solid black;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th {
        background-color: lightgray;
    }
</style>