import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListingCard from "../../components/ListingCard/ListingCard";
import { getListingsByCreatorCall } from "../../service/listingService";
import { getUserProfile } from "../../service/userService";
import { UserContext } from "../../UserProvider";

function ProfilePage(props) {
    const params = useParams();
    const navigate = useNavigate();
    const userHasChanged = useRef(false);
    const [profileUser, setProfileUser] = useState(null);
    const [listings, setListings] = useState(null);
    const { loggedUser } = useContext(UserContext);

    useEffect(() => {
        async function getData() {
            try {
                if (params.username === undefined) {
                    const res = await getUserProfile(loggedUser.username);
                    setProfileUser(res.user);
                }
                else {
                    const res = await getUserProfile(params.username);
                    setProfileUser(res.user);
                }
                userHasChanged.current = true;
            } catch (error) {
                console.log(error)
                toast.error("User not found");
                navigate('/')
            }
        }
        getData();
    }, [])

    useEffect(() => {
        async function loadListings() {
            if (!userHasChanged.current) return;
            try {
                const res = await getListingsByCreatorCall(profileUser._id);
                setListings(res.listings);
            } catch (error) {
                console.log(error)
            }
        }
        loadListings();
    }, [profileUser])

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="media profile rounded-circle p-0">
                                <img src="/default-user-image.png" alt="user"></img>
                            </div>
                        </div>
                        <div className="col-sm-8 py-5 px-4">
                            <h4>{profileUser?.username}</h4>
                            <p>{profileUser?.firstName} {profileUser?.lastName}</p>
                            <div className="border-top">
                                <p><strong>Contact info:</strong></p>
                                <p>Email: {profileUser?.email}</p>
                                <p>Mobile: {profileUser?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 mx-auto border-top pt-4">
                    <h3 className="pb-2">Properties auctioned: ({listings === null ? 0 : listings.length})</h3>
                    <div className="row mb-5 g-4">
                        {listings?.map((listing) => {
                            return <ListingCard key={listing._id} listing={listing}/>
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ProfilePage;
