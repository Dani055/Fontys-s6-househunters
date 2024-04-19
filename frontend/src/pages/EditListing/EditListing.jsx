import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EditListingForm from "../../components/forms/EditListingForm/EditListingForm";
import { getListingById } from "../../service/listingService";
import { UserContext } from "../../UserProvider";

function EditListing(props) {
  const params = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const { loggedUser } = useContext(UserContext);

  useEffect(() => {
    async function getData() {
      try {
        const res = await getListingById(params.listingId);
        setListing(res.listing)
      } catch (error) {
        console.log(error)
        toast.error("Error loading listing");
        // navigate('/')
      }
    }
    getData();
  }, [])

  return (
    <div className="container py-5">
      <h3 className="text-center pb-3">Edit your listing</h3>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12">
          <div
            className="card card-registration card-registration-2"
            style={{ borderRadius: 15 + "px" }}
          >
            <div className="card-body p-0">
              <div className="alert alert-danger" role="alert">
                Warning! If you choose to upload any photos all old photos will
                be deleted! In any other case they will remain.
              </div>
              {listing != null && 
                <EditListingForm listing={listing} editmode={true}/>
              }
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditListing;
