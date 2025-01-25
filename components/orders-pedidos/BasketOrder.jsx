const BasketOrder = ({ order }) => {
  return (
    <div className="pl-2 py-1">
      <hr className="" />
      <div>
        <div className="">
          - <span className="capitalize">{order.type}</span> -{" "}
          <span className="font-semibold capitalize">{order.name}</span>
        </div>

        {order.extras && order.extras.length > 0 && (
          <div>
            <p className="indent-8 text-sm mt-1">
              Extras:{" "}
              <span>
                {order.extras.map((extra, index) => (
                  <span key={extra._id} className="font-semibold text-gray-600">
                    {extra.name}
                    {index < order.extras.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketOrder;
