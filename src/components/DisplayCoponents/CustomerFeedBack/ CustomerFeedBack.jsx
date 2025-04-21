import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetFeedBack, FetDelete } from "../../redux/CounterSlice";
import "./CustomerFeedBack.scss";

const CustomerFeedBack = () => {
  const { FeedBack } = useSelector((state) => state.counter);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetFeedBack());
  }, [dispatch]);
  const deleteFeedBack = async (id) => {
    await dispatch(FetDelete(id));
    dispatch(fetFeedBack());
  };
  return (
    <div className="customerFeedBack">
      <div className="Customer-FeedBack">Customer Feedback</div>

      <div className="content">
        {FeedBack?.length > 0 ? (
          FeedBack.map((item, index) => (
            <div className="feedback" key={index}>
              <div className="top-row">
                <div className="feedback-content">{item.fullName}</div>
                <button onClick={() => deleteFeedBack(item.id)}>Delete</button>
              </div>
              <div className="feedback-email">{item.email}</div>
              <div className="feedback-mesage">{item.message}</div>
            </div>
          ))
        ) : (
          <p className="no-feedback">No feedback available.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerFeedBack;
