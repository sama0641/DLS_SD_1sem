<script>
    import axios from 'axios';

    async function getAccounts() {
        let accounts = await axios
        .get(`https://customerbackend.azurewebsites.net/accounts/${localStorage.customer_id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwttoken"),
                'Access-Control-Allow-Origin': '*',
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        })

        return accounts.data;
    }

    let accounts = getAccounts();
</script>

<main>
    <h1>Accounts</h1>
    
    <h3>List of accounts</h3>

    {#if localStorage.jwttoken == undefined || localStorage.jwttoken == null}
        <p>You need to be logged in to view this page</p>
    {:else}
        <button>
            <a href="#/accounts/add">Add new account</a>
        </button>
        {#await accounts}
            <h3>Loading accounts...</h3>
        {:then accounts} 
            {#if accounts.length === 0}
                <p>No accounts created</p>
            {:else}
                <table>
                    <thead>
                        <tr>
                            <th>Account ID</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>   
                        {#each accounts as account}
                            <tr>
                                <td>{account.id}</td>
                                <td>{account.title}</td>
                                <td>
                                    <a href="#/accounts/edit/{account.id}">Edit</a>
                                    <a href="#/accounts/delete/{account.id}">Delete</a>
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