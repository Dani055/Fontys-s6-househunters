import dayjs from "dayjs";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ListingCard.css"
function ListingCard(props) {
  const navigate = useNavigate();

  return (
    <div className="listing-card col-md-3">
      <Link className="text-decoration-none text-jet" to={"/listing/details/" + props.listing._id}>
      <div className="card bg-light shadow-sm">
        <div className="card-img-top">
        
          {props.listing.images.length === 0 ? <img
            src="Image_not_available.png"
            alt="img"
          /> :
            <img
              src={props.listing.images[0]}
              alt="img"
            />
          }
        </div>
        
        <div className="card-body mb-auto">
          <div>
            <h5 className="m-0">{props.listing.propertyType}</h5>
            <hr className="mt-2 mb-2"></hr>
          </div>
          
          <div className="description pb-1 mb-auto">
            <p className="card-text">
            {props.listing.description}
            </p>
          </div>

          <div className="mt-auto">
            {
              dayjs().isBefore(props.listing.startsOn) &&
              <div className="w-100 badge bg-opacity-50 text-dark-grey bg-warning py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-clock me-1" viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                </svg>
                Pending
              </div>
            }
            {
              dayjs().isAfter(props.listing.startsOn) && dayjs().isBefore(props.listing.endsOn) &&
              <div className="w-100 badge bg-opacity-25 text-success bg-success py-2" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-lg me-1" viewBox="0 0 16 16">
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                </svg>
                Live
              </div>
            }
            {
              dayjs().isAfter(props.listing.endsOn) &&
              <div className="w-100 badge background-red py-2" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                Ended
              </div>
            }
          </div>

        </div>
        <ul className="list-group text-center font-90 list-group-flush">
          <li className="list-group-item bg-light-gray"><i className="fa-solid fa-calendar-days me-1"></i>{props.listing.buildYear}</li>
          <li className="list-group-item bg-light-gray">
            <span>
              {/* {props.listing.bids.length === 0 ?
                "No bids yet" :
                <span>Highest bid: {props.listing.bids[0].amount} €</span>
              } */}
              <span>{props.listing.startingPrice}€</span>
            </span>
          </li>
          <li className="list-group-item bg-light-gray"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-geo-alt-fill me-1" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
          </svg>{props.listing.location}</li>
        </ul>
      </div>
      </Link>
    </div>
  );
}

export default ListingCard;
