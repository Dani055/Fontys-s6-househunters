import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createBidCall } from "../../../service/bidService";
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { UserContext } from "UserProvider";

function BidForm(props) {
  const params = useParams();
  const { loggedUser } = useContext(UserContext);
  const [amount, setAmount] = useState("");

  const handleFormChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createBidCall({ amount }, params.listingId);
      setAmount("");
      const bid = res.bid;
      bid.creator = loggedUser;
      props.onPostBid(bid);
      toast.success(res.message);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };


  return (
    <div className="place-bid mt-3">
      <h6>Place bid as {props.loggedUser.username}</h6>
      <form id="bidForm" onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            type="number"
            min={0}
            max={100000}
            onChange={handleFormChange}
            className="form-control"
            id="bidAmount"
            name="bidAmount"
            placeholder="Bid amount"
            aria-label="Bid amount"
            aria-describedby="button-bid"
          />
          <Tooltip className="tooltipsize" title={<Typography fontSize={14}><span >Place bid</span></Typography>} placement="top-start">
            <button
              className="btn btn-outline-dark mx-1 px-3"
              data-testid="buttonPostBid"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#confirmBidModal"
              id="button-bid">
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-coin" viewBox="0 0 16 16">
                <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z" />
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
              </svg>
            </button>
          </Tooltip>
        </div>
      </form>

      <div className="modal fade" id="confirmBidModal" tabIndex={-1} aria-labelledby="bidModalLabel">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="bidModalLabel">Place bid?</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure that you want to place your bid? This process is irrevirsible</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" data-bs-dismiss="modal" form="bidForm" className="btn btn-primary">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BidForm;
