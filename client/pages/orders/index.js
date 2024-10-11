const MyOrders = ({ orders }) => {
  console.log(orders);

  return (
    <div>
      <ul>
        {orders.map((order) => {
          return (
            <li
              key={order.id}
              className={
                order.status === "complete"
                  ? "fw-bold text-success"
                  : order.status === "cancelled"
                  ? "text-danger"
                  : ""
              }
            >
              {order.ticket.title} - {order.status}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

MyOrders.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default MyOrders;
