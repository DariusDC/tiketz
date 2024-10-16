import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const TicketDetails = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  const onPurchase = () => {
    doRequest();
  };

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price} $</h4>
      {errors}
      <button onClick={onPurchase} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketDetails.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketDetails;
