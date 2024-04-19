import React, { useEffect } from "react";

import Bid from "../Bid/Bid";
import "./BidHistory.css"
import { getUsersBulk } from "service/userService";
import { toast } from "react-toastify";
function BidHistory(props) {

  return (
    <div className="bid-history rounded mt-2 shadow-sm p-3">
      <h4>Bid history ({props.bids.length})</h4>
      {props.bids?.map((bid, index) => {
            return index !== 0 && <Bid key={bid._id} bid={bid}/>
      })}
    </div>
  );
}

export default BidHistory;
