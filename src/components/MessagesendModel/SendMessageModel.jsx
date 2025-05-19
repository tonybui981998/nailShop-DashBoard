import React, { useState } from "react";
import "./SendMessageModel.scss";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { adminEmail } from "../service/ApiService";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const SendMessageModel = ({ closeSendMessage, selectEvent }) => {
  let [loading, setLoading] = useState(false);
  const [clientMessage, setclientMessage] = useState();
  // validate
  const validate = () => {
    if (!clientMessage) {
      toast.error("please enter message");
      return false;
    }
    if (!selectEvent.email) {
      toast.error("please enter email");
      return false;
    }
    if (!selectEvent.title) {
      toast.error("please enter customer name");
      return false;
    }
    return true;
  };
  // send email
  const submitEmail = async () => {
    const check = validate();
    if (check === true) {
      const data = {
        ToEmail: selectEvent.email,
        Body: clientMessage,
        CustomerName: selectEvent.title,
      };
      setLoading(true);

      const respond = await adminEmail(data);
      if (respond.data.status === "success") {
        setLoading(false);
        toast.success(respond.data.message);
        closeSendMessage();
      } else {
        setLoading(false);
        toast.error(respond.data.message);
      }
    }
  };

  return (
    <div className="send-message-modal">
      <div className="modal-content">
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
        <h2>Send Message to {selectEvent.title}</h2>
        <p className="customer-email"></p>

        <textarea
          value={clientMessage}
          onChange={(e) => setclientMessage(e.target.value)}
          placeholder="Write your message..."
          className="message-input"
        />

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={() => closeSendMessage()}>
            Cancel
          </button>
          <button className="send-btn" onClick={() => submitEmail()}>
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageModel;
