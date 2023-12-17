<script>
    import axios from 'axios';

    async function getAdmins() {
        let admins = await axios
        .get('https://adminbackendserver.azurewebsites.net/admins', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwttoken"),
                'Access-Control-Allow-Origin': '*',
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        })

        return admins.data;
    }

    let admins = getAdmins();
</script>

<main>
    <h1>Dollardash admin overview</h1>
    
    <h3>List of admins</h3>

    <button>
        <a href="#/admins/add">Add new admin</a>
    </button>
    {#await admins}
        <h3>Loading Admins...</h3>
    {:then admins} 
        {#if admins.length === 0}
            <p>No admins found</p>
        {:else}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                    
                <tbody>   
                    {#each admins as admin}
                        <tr>
                            <td>{admin.admin_id}</td>
                            <td>{admin.username}</td>
                            <td>{admin.email}</td>
                            <td>
                                <a href="#/admins/edit/{admin.id}">Edit</a>
                                <a href="#/admins/delete/{admin.id}">Delete</a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
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