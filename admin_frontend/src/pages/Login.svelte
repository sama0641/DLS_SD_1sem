<script>

    let errortext = "";

    async function handleSubmit() {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        const query = `
        mutation Mutation($username: String!, $pass: String!) {
            Login(username: $username, pass: $pass) {
                email
                admin_id
                username
                is_superuser
                jwttoken
            }
        }`;
        // Define the variables for the query
        const variables = {
            username: username,
            pass: password
        };
        const header = {
            'Access-Control-Allow-Origin': '*',
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        }
        
        const response = await fetch('https://adminbackendserver.azurewebsites.net/auth/login', {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        const result = await response.json();
        const { Login } = result.data;
        console.log(result);
        if (Login == null) {
            errortext = "Wrong username or password";
            return;
        }

        localStorage.setItem("jwttoken", Login.jwttoken);
        localStorage.setItem("admin_id", Login.admin_id);
        localStorage.setItem("username", Login.username);
        localStorage.setItem("email", Login.email);
        localStorage.setItem("is_superuser", Login.is_superuser);
        
        window.location.href = "#/home";
        window.location.reload();
        if(result.error)
            {
                errortext = result.error;
            }
    } 
</script>

<main>
    <h1>Login</h1>
    <form on:submit|preventDefault="{handleSubmit}">
        <p>Insert username</p>
        <input
            id="username"
            type="text"
            placeholder="Username"
        />
        <p>Insert password</p>
        <input
            id="password"
            type="password"
            placeholder="Password"
        /> <br> <br>

        <p style="color: red">{errortext}</p>
        
        <button type="submit" class="form-field">
            Login
        </button>
    </form>
</main>
