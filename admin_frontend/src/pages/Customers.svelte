<script>

    async function getCustomers() {

        const query = `
        query GetCustomers {
            GetCustomers {
                first_name
                last_name
                age
                email
            }
        }`;
        // Define the variables for the query
        const header = {
            'Access-Control-Allow-Origin': '*',
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        }
        
        const response = await fetch('https://dls-admin-backend.azurewebsites.net/graphql', {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                query: query,
            })
        });

        const result = await response.json();
        
        return result.data.GetCustomers;
    }

    let customers = getCustomers();
</script>

<main>
    <h1>Dollardash customer overview</h1>
    
    <h3>List of customers</h3>

    {#if localStorage.getItem("jwttoken") == null || localStorage.getItem("jwttoken") == undefined}
        <p>You are not logged in</p>
    {:else}
        <button>
            <a href="#/customers/add">Add new customer</a>
        </button>

        {#await customers}
            <h3>Loading customers...</h3>
        {:then customers} 
            {#if customers.length === 0}
                <p>No customers found</p>
            {:else}
                <table>
                    <thead>
                        <tr>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Age</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                        
                    <tbody> 
                        {#each customers as customer}
                            <tr>
                                <td>{customer.first_name}</td>
                                <td>{customer.last_name}</td>
                                <td>{customer.age}</td>
                                <td>{customer.email}</td>
                                <td>
                                    <a href="#/customers/edit/{customer.id}">Edit</a>
                                    <a href="#/customers/delete/{customer.id}">Delete</a>
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
    }
    table {
        border-collapse: collapse;
    }
    th {
        background-color: lightgray;
    }
</style>

