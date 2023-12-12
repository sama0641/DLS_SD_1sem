<script>
    function handleLogout() {
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("admin_id");
        localStorage.removeItem("is_superuser");
        localStorage.removeItem("jwttoken");

        window.location.href = "#/home";
        window.location.reload();
    }
</script>

<nav class="topnav">
    <a href="#/home">Home</a>
    <a href="#/customers">Customers</a>

    {#if localStorage.getItem("is_superuser") == true}
        <a href="#/admins">Admins</a>
    {/if}

    {#if localStorage.getItem("jwttoken") !== null}
        <a href="#/home" on:click={handleLogout}>Logout</a>
    {:else}
        <a href="#/login">Login</a>
    {/if}
</nav> 



<style>
    /* Add a black background color to the top navigation */
    .topnav {
    background-color: #067f00;
    overflow: hidden;
    width: 100%;
    }

    /* Style the links inside the navigation bar */
    .topnav a {
    float: left;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
    }

    /* Change the color of links on hover */
    .topnav a:hover {
    background-color: #005809;
    color: black;
    }

</style>