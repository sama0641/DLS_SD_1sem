<script>
    import axios from 'axios';

    let password;
    let passwordTest;

    async function handleSubmit() {

        let firstname = document.getElementById("firstname").value;
        let lastname = document.getElementById("lastname").value;
        let age = document.getElementById("age").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        const header = {
                'Access-Control-Allow-Origin': '*',
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            }
        const query = `mutation CreateCustomer($firstname: String!, $lastname: String!, $age: Int!, $email: String!, $password: String!) {
  CreateCustomer(firstname: $firstname, lastname: $lastname, age: $age, email: $email, password: $password) {
    firstname
    lastname
    age
    email
    password
  }
}`

        const variables = {
            firstname: firstname,
            lastname: lastname,
            age: Number(age),
            email: email,
            password: password
        }

        const response = await fetch('https://dls-admin-backend.azurewebsites.net/graphql', {
            method: 'POST',
            headers: header,    
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        })

        const result = await response.json();
        if(result.errors) {
            alert("An error happened", result.errors);
            return;
        }else {
            alert("Customer added");
            window.location.href = "#/customers";
        }
    }


</script>

<h1>Add customer</h1>

<form on:submit|preventDefault="{handleSubmit}">
    Insert first name:
    <input type="text" name="firstname" id="firstname" ><br>
    
    Insert last name:
    <input type="text" name="lastname" id="lastname" ><br>
    
    Insert age:
    <input type="number" name="age" id="age" ><br>
    
    Insert email:
    <input type="email" name="email" id="email" ><br>
    
    Insert password:
    <input bind:value={password} type="password" name="password" id="password" ><br>
    
    Please repeat password:
    <input bind:value={passwordTest} type="password" name="passwordTest" id="passwordTest" ><br>

    {#if password !== passwordTest || password === "" || passwordTest === ""}
        <p style="color: red">Passwords do not match</p>
        <button type="submit" disabled>Add customer</button>
    {:else}
        <button type="submit">Add customer</button>
    {/if}
</form>

<style>
    form {
        position: left;
    }
</style>