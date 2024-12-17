const BasketOrder = ({ order }) => {
  return (
    <div className="pl-2 py-1">
      <hr className="" />
      <div>
        <div className="">
          - <span className="capitalize">{order.type}</span> -{" "}
          <span className="font-semibold capitalize">{order.name}</span> x{" "}
          <span className="font-semibold ">{order.count}</span>
        </div>
      </div>
    </div>
  );
};

export default BasketOrder;
