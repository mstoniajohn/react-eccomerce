import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/layout/Header';
import NavBar from './components/NavBar';
import { CssBaseline } from '@material-ui/core';
import Products from './components/products/Products';
import { commerce } from './lib/commerce';
import Basket from './components/basket/Basket';
import Checkout from './components/checkout/Checkout';
import CustomCard from './components/card/CustomCard';

function App() {
	const [products, setProducts] = useState([]);
	const [basketData, setBasketData] = useState({});
	const [orderInfo, setOrderInfo] = useState({});
	const [orderError, setOrderError] = useState('');
	const fetchProducts = async () => {
		const response = await commerce.products.list();
		setProducts((response && response.data) || []);
	};
	const fetchBasketData = async () => {
		const response = await commerce.cart.retrieve();
		console.log(response);
		setBasketData(response);
	};

	const addProduct = async (productId, quantity) => {
		const response = await commerce.cart.add(productId, quantity);
		setBasketData(response.cart);
	};

	const RemoveItemFromBasket = async (itemId) => {
		const response = await commerce.cart.remove(itemId);
		setBasketData(response.cart);
	};

	const handleEmptyBasket = async () => {
		const response = await commerce.cart.empty();
		setBasketData(response.cart);
	};

	const updateProduct = async (productId, quantity) => {
		const response = await commerce.cart.update(productId, { quantity });
		setBasketData(response.cart);
	};

	const refreshBasket = async () => {
		const newBasketData = await commerce.cart.refresh();
		setBasketData(newBasketData);
	};

	const handleCheckout = async (checkoutId, orderData) => {
		try {
			// const incomingOrder = await commerce.checkout.capture(
			//   checkoutId,
			//   orderData
			// );

			setOrderInfo(orderData);

			refreshBasket();
		} catch (error) {
			setOrderError(
				(error.data && error.data.error && error.data.error.message) ||
					'An error occurred'
			);
		}
	};

	useEffect(() => {
		fetchProducts();
		fetchBasketData();
	}, []);
	console.log(products);
	return (
		// <div>
		// 	<Products products={products} />
		// </div>
		<Router>
			<CssBaseline />
			<NavBar
				basketItems={basketData.total_items}
				totalCost={
					(basketData.subtotal && basketData.subtotal.formatted_with_symbol) ||
					'00.00'
				}
			/>
			<div className="App">
				<Switch>
					<Route path="/" exact>
						<Products products={products} addProduct={addProduct} />
					</Route>
					<Route path="/basket">
						<Basket
							basketData={basketData}
							// addProduct={addProduct}
							updateProduct={updateProduct}
							handleEmptyBasket={handleEmptyBasket}
							RemoveItemFromBasket={RemoveItemFromBasket}
						/>
					</Route>
					<Route exact path="/checkout">
						<Checkout
							orderInfo={orderInfo}
							orderError={orderError}
							basketData={basketData}
							handleCheckout={handleCheckout}
						/>
					</Route>
					{/* <Route exact path="/basket">
						<CustomCard
							product={product}
							orderError={orderError}
							basketData={basketData}
							handleCheckout={handleCheckout}
						/>
					</Route> */}
				</Switch>
			</div>
		</Router>
	);
}

export default App;
