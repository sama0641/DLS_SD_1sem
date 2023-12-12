<script>
    import Router from 'svelte-spa-router';

	import Home from './pages/Home.svelte';
	import Login from './pages/Login.svelte';
	import Accounts from './pages/Accounts.svelte';
	import Transactions from './pages/Transactions.svelte';

	import PageNotFound from './pages/PageNotFound.svelte';

	import Topbar from './pages/components/Topbar.svelte';
	import Footer from './pages/components/Footer.svelte';

	let routes = {
		'/' : Home,
		'/home': Home,
		'/login': Login,
		'/accounts': Accounts,
		'/transactions': Transactions,

		'*': PageNotFound
	}
</script>

<main>
	<Topbar {Topbar} />
	<body>
			<Router {routes} />
	</body>
	<Footer {Footer} />
</main>

<style>
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
	}

	body {
		padding: 4.5rem;
	}


	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>