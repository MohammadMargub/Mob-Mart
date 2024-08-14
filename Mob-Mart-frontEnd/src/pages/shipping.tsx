import { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const navigate = useNavigate();

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, name: e.target.value }));
  };

  return (
    <div className="shipping">
      <button>
        <BiArrowBack className="back-btn" onClick={() => navigate("/cart")} />
      </button>
      <form>
        <h1>Shipping address</h1>
        <input
          required
          type="text"
          placeholder="Address"
          name="addeess"
          value={shippingInfo.address}
          onChange={changeHandler}
        ></input>

        <input
          required
          type="text"
          placeholder="City"
          name="City"
          value={shippingInfo.city}
          onChange={changeHandler}
        ></input>
        <input
          required
          type="text"
          placeholder="Country"
          name="Country"
          value={shippingInfo.country}
          onChange={changeHandler}
        ></input>

        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        ></input>

        <select name="country" required value={shippingInfo.country}>
          <option value="">Choose Country</option>
          <option value="india">India</option>
        </select>

        <input
          required
          type="text"
          placeholder="Address"
          name="addeess"
          value={shippingInfo.state}
          onChange={changeHandler}
        ></input>

        <button type="submit" className="button">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Shipping;
