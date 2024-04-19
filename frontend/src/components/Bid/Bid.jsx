import dayjs from "dayjs";
import React from "react"

import { Link } from "react-router-dom";
import { displayUsername, profileUrl } from "service/userService";

function Bid(props) {

    return (
        <div className="bg-light-gray shadow-sm rounded p-3 mt-4">
        <p>
          <Link className="link-dark" to={profileUrl(props.bid.creator)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-person"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
            </svg>{" "}
            {displayUsername(props.bid)}
          </Link>{" "}
          bid <span className="bold">{props.bid.amount}€</span>
        </p>
        <p className="m-0">
          Placed on <span className="bold">{dayjs(props.bid.createdAt).format("DD/MM/YYYY HH:mm")}</span>
        </p>
      </div>
    )
}

export default Bid;