import React, { useEffect, useState, useContext } from "react";
import Carousel from "../../components/Carousel/Carousel";
import { Link, useNavigate, useParams } from "react-router-dom";
import ListingAccordion from "../../components/ListingAccordion/ListingAccordion";
import BidForm from "../../components/forms/BidForm/BidForm";
import BidHistory from "../../components/BidHistory/BidHistory";
import { deleteListingCall, getListingById } from "../../service/listingService";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { UserContext } from "../../UserProvider";
import TimerComponent from "../../components/TimerComponent/TimerComponent";
import "./ListingDetails.css"
import ListingComments from "../../components/ListingComments/ListingComments";
import { getBidsForListingCall } from "service/bidService";
import { displayUsername, getUsersBulk, mapEntityWithCreator, profileUrl } from "service/userService";

function ListingDetails(props) {
  const params = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [bids, setBids] = useState(null);
  const { loggedUser } = useContext(UserContext);

  useEffect(() => {
    getListing();
    getBids();
  }, [])

  async function getListing() {
    let listing;
    try {
      const resListing = await getListingById(params.listingId);
      const resOwner = await getUsersBulk([resListing.listing.creatorId]);
      listing = resListing.listing;
      listing.creator = resOwner.userIdToUser[listing.creatorId];
      setListing(listing);
    } catch (error) {
      toast.error("Error loading listing");
      navigate('/')
    }
    getUsersForComments(listing);
  }
  async function getBids() {
    let resBids;
    try {
      resBids = await getBidsForListingCall(params.listingId);
      setBids(resBids.bids);
    } catch (error) {
      toast.error("Error loading bids");
    }
    getUsersForBids(resBids.bids);
  }
  const addLocalBid = (bid) => {
      setBids([bid, ...bids])
  };
  const addLocalComment = (comment) => {
    const newListing = {...listing};
    newListing.comments = [comment, ...listing.comments]
    setListing(newListing);
  };
  const removeLocalComment = (id) => {
    const newListing = {...listing};
    newListing.comments = listing.comments.filter(c => c._id !== id)
    setListing(newListing);
  };
  const deleteListing = async () => {
    try {
      const res = await deleteListingCall(params.listingId);
      toast.success(res.message)
      navigate('/')
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const getUsersForBids = async (bidsNoUser) => {
    try {
      const bidsWithUsers = await mapEntityWithCreator(bidsNoUser);
      setBids(bidsWithUsers);
    } catch (error) {
      toast.error("Could not get bidders")
    }
  }
  const getUsersForComments = async (listing) => {
    try {
      const commentsWithUsers = await mapEntityWithCreator(listing.comments);
      const newlisting = {...listing, comments: commentsWithUsers}
      setListing(newlisting);
    } catch (error) {
      toast.error("Could not get commenters")
    }
  }
  const deleteButtonHTML = () => {
    return <>
      <button data-testid="buttonDeleteListing" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" className="btn btn-danger ms-3">
        Delete listing
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill ms-1" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
        </svg>
      </button>
      {modalHTML()}
    </>
  }

  const modalHTML = () => {
    return <div
      className="modal fade"
      id="confirmDeleteModal"
      tabIndex={-1}
      aria-labelledby="deleteModalLabel">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-black" id="deleteModalLabel">
              Delete listing?
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-black">
            <p>
              Are you sure that you want to delete this listing? This
              process is irrevirsible
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-bs-dismiss="modal"
              onClick={deleteListing}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>;
  }

  const displayDeleteButton = () => {
    if (loggedUser?._id === listing.creatorId) {
      if (dayjs().isBefore(listing.startsOn)) {
        return deleteButtonHTML();
      }
    }
    if (loggedUser?.roles.includes('Admin')) {
      return deleteButtonHTML();
    }
  };

  const displayBidForm = () => {
    if (loggedUser !== null && dayjs().isAfter(listing.startsOn) && dayjs().isBefore(listing.endsOn)) {
      return <BidForm onPostBid={addLocalBid} loggedUser={loggedUser} />;
    }
  }

  return (
    <div className="container">
      {
        listing !== null &&
        <div className="row my-4">
          <div id="listing-headline">
          <h3>
            {listing.propertyType} - {listing.location}
            {
              dayjs().isBefore(listing.startsOn) &&
              <span className="badge text-dark-grey border-primary ms-2">Pending</span>
            }
            {
              dayjs().isAfter(listing.startsOn) && dayjs().isBefore(listing.endsOn) &&
              <span className="badge bg-opacity-75 bg-primary ms-2">Live</span>
            }
            {
              dayjs().isAfter(listing.endsOn) &&
              <span className="badge bg-opacity-75  bg-danger ms-2">Ended</span>
            }
          </h3>
          </div>
          <div className="col-md-6 ">
            <Carousel images={listing.images} />
            <div className="border-purple-light p-3 border-2 border rounded-bottom">
              <div className="row">
                <div className="col-auto me-auto">
                  <p className="m-0">
                    Property owner:
                    <Link className="link-dark" to={profileUrl(listing.creator)}>
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
                      {displayUsername(listing)}
                    </Link>
                  </p>
                </div>
                <div className="col-auto buttons">
                  {
                    (loggedUser?._id === listing.creatorId || loggedUser?.roles.includes('Admin')) &&
                    <button data-testid="buttonEditListing" type="button" className="btn btn-primary" onClick={() => navigate("/listing/edit/" + listing._id)}>
                      Edit listing
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil ms-1" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                      </svg>
                    </button>
                  }
                  {
                    displayDeleteButton()
                  }
                </div>
              </div>
            </div>
            <ListingAccordion listing={listing} />
            <ListingComments onDeleteComment={removeLocalComment} onPostComment={addLocalComment} listing={listing} comments={listing.comments} />
          </div>
          <div className="col-md-6">
            {bids && <div className="mb-2 rounded-top shadow-sm">
              {
                bids[0] !== undefined &&
                <div className="current-bid-details border-thick-right bg-success text-success bg-opacity-10 p-3">
                  <p>
                    {dayjs().isAfter(listing.endsOn) ? "Winner: " : "Leading bid: "}
                    <Link className="link-success" to={profileUrl(bids[0].creator)}>
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
                      {displayUsername(bids[0])}
                    </Link>
                  </p>
                  <h3 id="leadingBidH3">{bids[0].amount}€</h3>
                  <p>
                    Placed on <span className="bold">
                      {dayjs(bids[0]?.createdOn).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </p>
                </div>
              }
              {
                bids.length === 0 && dayjs().isAfter(listing.startsOn) && dayjs().isBefore(listing.endsOn) &&
                <h4 className="p-3 bg-primary border-thick-right border-dark">
                  This property has no bids yet!
                </h4>
              }

              {
                bids.length === 0 && dayjs().isAfter(listing.endsOn) &&
                <div className="bg-light shadow-sm p-3 border-thick-right border-danger">
                  <h4>
                    <span className="text-red">
                      This property failed to sell!
                    </span>
                  </h4>
                </div>
              }
            </div>}
            <div className="bg-light border-thick-right border-gray shadow-sm p-3">
              {
                dayjs().isBefore(listing.startsOn) &&
                <>
                  <p>
                    Bidding starts on <span className="bold">{dayjs(listing.startsOn).format("DD/MM/YYYY HH:mm")}</span>
                  </p>
                  <TimerComponent diffDate={listing.startsOn} />
                </>
              }
              {
                dayjs().isAfter(listing.startsOn) && dayjs().isBefore(listing.endsOn) &&
                <>
                  <p>
                    Bidding ending on <span className="bold">{dayjs(listing.endsOn).format("DD/MM/YYYY HH:mm")}</span>
                  </p>
                  <TimerComponent diffDate={listing.endsOn} />
                </>
              }
              {
                dayjs().isAfter(listing.endsOn) &&
                <>
                  <p className="m-0">
                    Bidding ended on: <span className="bold">{dayjs(listing.endsOn).format("DD/MM/YYYY HH:mm")}</span>
                  </p>
                </>
              }
              {displayBidForm()}
            </div>

            {bids ? <BidHistory bids={bids} /> : <p className="mt-2">Bid history unavailable</p>}

          </div>
        </div>
      }
    </div>
  );
}

export default ListingDetails;
