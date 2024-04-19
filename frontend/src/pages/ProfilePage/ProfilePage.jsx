import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListingCard from "../../components/ListingCard/ListingCard";
import { getListingsByCreatorCall } from "../../service/listingService";
import { deleteUserAccount, getUserProfile } from "../../service/userService";
import { UserContext } from "../../UserProvider";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

function ProfilePage(props) {
    const params = useParams();
    const navigate = useNavigate();
    const userHasChanged = useRef(false);
    const [profileUser, setProfileUser] = useState(null);
    const [listings, setListings] = useState(null);
    const { loggedUser, setLoggedUser } = useContext(UserContext);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')

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

    const deleteAccount = async () => {
        try {
            setDeleteDialogOpen(false)
            await deleteUserAccount(loggedUser._id);
            window.sessionStorage.removeItem("tkn");
            setLoggedUser(null);
            toast.success("Account deleted")
        } catch (error) {
            console.log(error)
            toast.error("Error deleting account");
        }
    }

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
                            {loggedUser && loggedUser?._id === profileUser?._id && <button onClick={() => setDeleteDialogOpen(true)} type="button" className="btn btn-danger ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle mb-1 me-1" viewBox="0 0 16 16">
                                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                                </svg>
                                Delete profile
                            </button>}
                        </div>
                    </div>
                </div>
                <div className="col-md-12 mx-auto border-top pt-4">
                    <h3 className="pb-2">Properties auctioned: ({listings === null ? 0 : listings.length})</h3>
                    <div className="row mb-5 g-4">
                        {listings?.map((listing) => {
                            return <ListingCard key={listing._id} listing={listing} />
                        })}
                    </div>
                </div>
            </div>
            <Dialog maxWidth='sm' fullWidth open={deleteDialogOpen} onClose={() => { setDeleteDialogOpen(false) }}>
                <DialogTitle className="text-danger">
                    Account deletion
                </DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete your account? This action is irrevirsible</p>
                    <p>Type "permanently delete" to confirm</p>
                    <input
                        type="text"
                        className="form-control"
                        id="confirmText"
                        name="confirmText"
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        value={deleteConfirmText}
                        placeholder="permanently delete"
                    />
                </DialogContent>
                <DialogActions>
                    <div className="d-flex justify-content-between w-100 px-2 pb-1">
                        <Button onClick={() => { setDeleteDialogOpen(false) }} color="primary" size='sm'>Cancel</Button>
                        <Button disabled={deleteConfirmText !== "permanently delete"} onClick={deleteAccount} variant="contained" color="error">
                            Confirm
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProfilePage;
