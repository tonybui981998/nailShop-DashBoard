import React, { useEffect, useState } from "react";
import "./CheckOutModel.scss";
import { toast } from "react-toastify";
import { checkout, checkvoucher } from "../service/ApiService";
import HashLoader from "react-spinners/HashLoader";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const CheckOutModel = ({
  selectEvent,
  allServiceBooking,
  closeCheckout,
  checkConfirmcheckout,
}) => {
  let [loading, setLoading] = useState(false);
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [allService, setAllService] = useState(allServiceBooking);
  const [EditPriceService, setEditPriceService] = useState(null);
  const [tempPrice, settempPrice] = useState(
    allServiceBooking.map((s) => s.price)
  );
  const [totalPriceService, settotalPriceService] = useState();
  const [disCount, setdisCount] = useState(0);
  const [voucher, setVoucher] = useState(null);
  const [voucherMessage, setVoucherMessage] = useState();
  const [voucherAmount, setVoucherAmount] = useState(0);
  const [remainMoney, setremainMoney] = useState(0);
  const [status, setStatus] = useState("confirmed");
  const [voucherInfor, setVoucherInfor] = useState(null);
  const [voucherUse, setVoucherUse] = useState(0);

  const handleEditPriceService = (index) => {
    setEditPriceService((prev) => (prev === index ? null : index));
  };

  // onchange edit price
  const editPrice = (e, index) => {
    const updatePrice = [...tempPrice];
    updatePrice[index] = e.target.value;
    settempPrice(updatePrice);
  };
  // update price
  const UpdatePrice = (index) => {
    const priceUpdate = allService.map((item, id) =>
      id === index ? { ...item, price: tempPrice[id] } : item
    );
    setAllService(priceUpdate);
    setEditPriceService(null);
  };
  // console.log("check", allService);
  // calculate totalPrice
  const totalprice = () => {
    const total = allService.reduce(
      (total, priceEach) => total + parseFloat(priceEach.price),
      0
    );
    const checkDiscount = total - (total * disCount) / 100;
    const checkUseAmount = Math.min(checkDiscount, voucherAmount);
    setVoucherUse(checkUseAmount);
    if (voucherAmount) {
      if (voucherAmount < checkDiscount) {
        const priceaftervoucher = checkDiscount - voucherAmount;
        settotalPriceService(priceaftervoucher);
        setremainMoney(0);
      }
      if (voucherAmount > checkDiscount) {
        const totalfinalPrice = voucherAmount - checkDiscount;
        settotalPriceService(0);
        setremainMoney(totalfinalPrice);
      }
      if (voucherAmount === checkDiscount) {
        const totalfinalPrice = voucherAmount - checkDiscount;
        settotalPriceService(0);
        setremainMoney(0);
      }
    } else {
      settotalPriceService(checkDiscount);
    }
  };
  // check voucher button
  const voucherchecking = async () => {
    const send = {
      Code: voucher,
    };
    const result = await checkvoucher(send);
    if (result.data.status === "error") {
      setVoucherMessage("Sorry voucher do not exist");
    } else {
      setVoucherInfor(result.data);
      setVoucherMessage(result.data.remainingAmount);
      setVoucherAmount(result.data.remainingAmount);
    }
  };
  useEffect(() => {
    if (!voucher) {
      setVoucherMessage();
    }
  }, [voucher]);
  useEffect(() => {
    totalprice();
  }, [allService, disCount, voucherAmount]);
  //  confirm complete
  const checkoutConfirm = async () => {
    setLoading(true);
    const data = {
      bookingConfirmDto: {
        bookingStatus: status,
        voucherAmount: voucherAmount,
        voucherCode: voucher,
        discount: disCount,
        totalPay: totalPriceService,
        bookingId: selectEvent.bookedId,
        CusName: selectEvent.title,
        CusPhone: selectEvent.customerPhone,
        remainingMoney: remainMoney,
        BookingDate: selectEvent.DateTime,
        StartTime: selectEvent.bookingStart,
        EndTime: selectEvent.bookingEnd,
        service: allService.map((s) => ({
          selectedService: s.selectedService,
          duration: s.duration,
          price: s.price,
        })),
      },
      voucherUsageDto: {
        voucherId: voucherInfor?.id || 0,
        usedAmount: voucherUse,
        usedBy: selectEvent.title,
      },
    };
    console.log("check data", data);
    setTimeout(async () => {
      setLoading(false);
      const respond = await checkout(data);
      console.log("check respond", respond);
      toast.success("success");
      checkConfirmcheckout();
      setTimeout(() => {
        closeCheckout();
      }, 1500);
      console.log(data);
    }, 3000);
  };
  console.log("check voucher", selectEvent);
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {loading && (
          <div className="overlay">
            <HashLoader
              color={"red"}
              loading={loading}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        <div className="checkout-model">
          <button className="close-button" onClick={closeCheckout}>
            &times;
          </button>

          <h2>Check Out</h2>

          <div className="customer-info">
            <strong>Customer:</strong> {selectEvent?.title || "N/A"}
          </div>

          <div className="status-section">
            <label className="status-label">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-dropdown"
            >
              <option value="did-not-come">Did not come</option>
              <option value="confirmed">Confirmed</option>
              <option value="come-late">Come late</option>
            </select>
          </div>

          <div className="service-list">
            <h4>Services:</h4>
            <ul>
              {allService?.map((service, index) => (
                <li key={index}>
                  <div className="service-row">
                    <span>{service.selectedService}</span>
                    <span onClick={() => handleEditPriceService(index)}>
                      ${service.price}
                    </span>
                  </div>

                  {EditPriceService === index && (
                    <div className="edit-price-group">
                      <input
                        onChange={(e) => editPrice(e, index)}
                        value={tempPrice[index]}
                        type="number"
                        className="price-input"
                        placeholder="Enter price"
                      />
                      <span
                        className="save-button"
                        onClick={() => UpdatePrice(index)}
                      >
                        Save
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="price-section">
            <div className="discount">
              <label>Discount:</label>
              <select onChange={(e) => setdisCount(parseFloat(e.target.value))}>
                <option value="0">0%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
              </select>
            </div>

            <div className="voucher">
              <label htmlFor="voucher-code">Voucher Code</label>
              <div className="voucher-input-group">
                <input
                  id="voucher-code"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                  type="text"
                  placeholder="Enter voucher code"
                />
                <button onClick={voucherchecking}>Apply</button>
              </div>
              {voucherMessage && (
                <div className="voucher-display">{voucherMessage}</div>
              )}
            </div>

            <div className="total-price">
              <label>Total Price:</label>
              <span>${totalPriceService}</span>
            </div>
          </div>

          <div className="submit-button-container">
            <button className="submit-button" onClick={() => checkoutConfirm()}>
              Complete Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutModel;
