import {RestaurantClient} from "./src/client";

async function demo() {
    const client = new RestaurantClient("http://localhost:4000");

    const {token} = await client.login("my-gpt-client");
    client.setToken(token);
    console.log("Token:", token);

    const menu = await client.getMenu();
    console.log("Menu:", menu.items);

    const {sessionId, orderId} = await client.createOrder({
        items: [{id: "pizza-margherita", price: 20, qty: 1}],
    });
    console.log("Order:", sessionId, orderId);

    const order = await client.getOrder(orderId);
    console.log("Status:", order.status);

    const list = await client.listOrders(sessionId);
    console.log("Orders:", list.count);
}

demo().catch(console.error);
