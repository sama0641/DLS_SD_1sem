<script>
    import axios from 'axios';

    let password;
    let passwordTest;

    async function handleSubmit() {
        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        let data = {
            username: username,
            email: email,
            password: password
        }

        await axios({
            method: 'post',
            url: 'http://localhost:3000/add_account',
            headers: {
                jswtoken: localStorage.getItem("jwttoken"),
                'Access-Control-Allow-Origin': '*',
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            data: data
        })
        .then(data => {
            alert("Account added");
            window.location.href = "#/accounts";
        })
        .catch(error => {
            console.log(error);
            alert("An error occured");
        })
    }

</script>

<h1>Add admin</h1>

<form on:submit|preventDefault="{handleSubmit}">
    Insert receiver id <br>
    <input type="text" name="reciever" id="reciever" ><br>
    
    Insert email: <br>
    <input type="email" name="email" id="email" ><br>
    
    Insert password: <br>
    <input bind:value={password} type="password" name="password" id="password" ><br>
    
    Please repeat password: <br>
    <input bind:value={passwordTest} type="password" name="passwordTest" id="passwordTest" ><br>

    {#if password !== passwordTest || password === "" || passwordTest === ""}
        <p style="color: red">Passwords do not match</p>
        <button type="submit" disabled>Add customer</button>
    {:else}
        <p> ___________</p>
        <button type="submit">Add admin</button>
    {/if}
</form>
