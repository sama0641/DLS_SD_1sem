<script>
    import axios from "axios";

    let errortext = "";

    async function handleSubmit() {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        let data = {
            email: email,
            password: password
        }

        await axios({
            method: 'post',
            url: 'https://customerbackend.azurewebsites.net/auth/login',
            headers: {
                'Access-Control-Allow-Origin': '*',
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            data: data
        })
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log(data.data.data);
                localStorage.setItem("jwttoken", data.data.jwttoken);
                localStorage.setItem("customer_id", data.data.customer_id);
                localStorage.setItem("first_name", data.data.first_name);
                localStorage.setItem("last_name", data.data.last_name);
                localStorage.setItem("email", data.data.email);
                window.location.href = "#/home";
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            errortext = error;
        });
    }
        
</script>

<main>
    <h1>Login</h1>
    <form on:submit|preventDefault="{handleSubmit}">
        <p>Insert email</p>
        <input
            id="email"
            type="email"
            placeholder="Email"
        />
        <p>Insert password</p>
        <input
            id="password"
            type="password"
            placeholder="Password"
        /> <br> <br>
        <p style="color:red">{errortext}</p>
        <button type="submit" class="form-field">
            Login
        </button>
    </form>
</main>
