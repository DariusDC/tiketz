import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const OrderDetails = ({ order, currentUser }) => {
  const [time, setTime] = useState(0);

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (res) => {
      Router.push("/orders");
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      const value = Math.round(msLeft / 1000);

      setTime(value);
    };

    findTimeLeft();
    const timerId = setInterval(() => {
      findTimeLeft();
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (time < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      Time left to pay: {time} seconds
      {errors}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51Q8QlIRu7x5TFE25S15TY5WE84fY0yBJTpel90tHCqsL3EYIUjuZQf6ZsS0R5kNZkN3XV06HYPJaAQXzuNzb1TiV00QkWspg7d"
        amount={order.ticket.price * 100}
        currency="USD"
        email={currentUser.email}
      />
    </div>
  );
};

OrderDetails.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data, currentUser };
};

export default OrderDetails;
