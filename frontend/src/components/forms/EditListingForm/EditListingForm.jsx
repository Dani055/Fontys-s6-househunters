import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditListingForm.css"
import { toast } from 'react-toastify';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createListingCall, editListingCall } from "../../../service/listingService";
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import dayjs from "dayjs";
import axios from "axios";

function EditListingForm(props) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ propertyType: "", buildYear: "1950", size: "", listingDescription: "", startingPrice: "", buyoutPrice: "", location: "" });
  const [startsOn, setStartsOn] = useState(dayjs());
  const [endsOn, setEndsOn] = useState(dayjs());
  const [imageFiles, setImageFiles] = useState(null);

  useEffect(() => {
    if (props.editmode) {
      let newFormState = {
        propertyType: props.listing.propertyType,
        buildYear: props.listing.buildYear,
        size: props.listing.size,
        listingDescription: props.listing.listingDescription,
        startingPrice: props.listing.startingPrice,
        buyoutPrice: props.listing.buyoutPrice,
        location: props.listing.location
      }
      setStartsOn(dayjs(props.listing.startsOn));
      setEndsOn(dayjs(props.listing.endsOn));
      setFormState(newFormState);
    }
  }, [])

  const handleFormChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState({ ...formState, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let body = { ...formState, startsOn, endsOn, newImages: imageFiles ? true : false };
      let res;
      if (props.editmode) {
        res = await editListingCall(body, props.listing._id);
      }
      else {
        res = await createListingCall(body);
      }
      if(imageFiles){
        let formData = new FormData();
        for (let i = 0; i < imageFiles?.length; i++) {
          formData.append("photo", imageFiles[i]);
        }
        formData.append('listingId', res.listing._id)
        const imageRes = axios.post("/api/media/upload", formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
      }
      toast.success(res.message);
      navigate('/')
    } catch (err) {
      toast.error(err);
    }

  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <form onSubmit={handleSubmit}>
      <div className="row g-0">
        <div className="col-lg-6">
          <div className="p-5">
            <h3
              
            >
              General property infomation
            </h3>

            <div className="mb-4 pb-2">
              <label htmlFor="formFileMultiple" className="form-label">
                Upload photos:
              </label>
              <input
                className="form-control"
                type="file"
                accept="image/*"
                id="photosUpload"
                name="photosUpload"
                onChange={handleImageChange}
                multiple
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="form-floating mb-3">
                <Tooltip  className="tooltipsize" title={<Typography fontSize={14}>The type of the property. <span className="text-mint">Min. 2 characters!</span></Typography>} placement="top-start" arrow>
                <input
                    type="text"
                    className="form-control"
                    id="propertyType"
                    name="propertyType"
                    onChange={handleFormChange}
                    value={formState.propertyType}
                    placeholder="Apartment"
                  />
                </Tooltip>
                  
                  <label htmlFor="floatingInput">Property type *</label>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="form-floating mb-3">
                <Tooltip className="tooltipsize" title={<Typography fontSize={14}>The size of the property (in squared meters)</Typography>} placement="top-start" arrow>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    className="form-control"
                    id="size"
                    name="size"
                    onChange={handleFormChange}
                    value={formState.size}
                    placeholder="120m2"
                  />
                  </Tooltip>
                  <label htmlFor="floatingInput">Size (m²)*</label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="form-floating">
              <Tooltip  className="tooltipsize" title={<Typography fontSize={14}>Description of the listing <span className="text-mint">Min. 10 characters!</span></Typography>} placement="top-start" arrow>
                <textarea
                  className="form-control"
                  placeholder="Vehicle description here"
                  id="listingDescription"
                  name="listingDescription"
                  onChange={handleFormChange}
                  value={formState.listingDescription}
                ></textarea>
                </Tooltip>
                <label htmlFor="floatingTextarea">Description *</label>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="form-floating mb-3">
                <Tooltip  className="tooltipsize" title={<Typography fontSize={14}>Location of the bike</Typography>} placement="top-start" arrow>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    onChange={handleFormChange}
                    value={formState.location}
                    placeholder="The moon"
                  />
                  </Tooltip>
                  <label htmlFor="floatingInput">Location *</label>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="form-floating mb-3">
                <Tooltip  className="tooltipsize" title={<Typography fontSize={14}>Year which the property was built</Typography>} placement="top-start" arrow>
                  <input
                    type="number"
                    min={1950}
                    max={2024}
                    className="form-control"
                    id="buildYear"
                    name="buildYear"
                    onChange={handleFormChange}
                    value={formState.buildYear  }
                    placeholder="2022"
                  />
                  </Tooltip>
                  <label htmlFor="floatingInput">Build year*</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 background-main-alpha text-white">
          <div className="p-5">
            <h3 className="fw-normal mb-5">Listing details</h3>

            <div className="mb-4 pb-2">
              <label className="form-label" htmlFor="form3Examplea3">
                Start date*
              </label>
              <div data-testid="startsOn">
                <DateTimePicker
                  className="bg-light text-dark p-3 rounded"
                  id="startsOn"
                  data-testid="startsOn"
                  name="startsOn"
                  onChange={(newValue) => setStartsOn(newValue)}
                  value={startsOn}
                />
              </div>
            </div>

            <div className="mb-4 pb-2">
              <label className="form-label" htmlFor="form3Examplea3">
                End date*
              </label>
              <div data-testid="endsOn">
                <DateTimePicker
                  className="bg-light text-dark p-3 rounded"
                  id="endsOn"
                  name="ensOn"
                  onChange={(newValue) => setEndsOn(newValue)}
                  value={endsOn}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-1 text-black">
                <div className="form-floating mb-3">
                <Tooltip title={<Typography fontSize={14}>Starting price of the listing <span className="text-mint">Min. €1000</span></Typography>} placement="top-start" arrow>
                  <input
                    type="number"
                    min={0}
                    max={1000000}
                    className="form-control"
                    id="startingPrice"
                    onChange={handleFormChange}
                    value={formState.startingPrice}
                    name="startingPrice"
                    placeholder="20"
                  />
                  </Tooltip>
                  <label htmlFor="floatingInput">Starting Price*</label>
                </div>
              </div>
              <div className="col-md-6 mb-4 text-black">
                <div className="form-floating mb-1">
                <Tooltip title={<Typography fontSize={14}>Buyout price of the listing <span className="text-mint">Max. €2 000 000</span></Typography>} placement="top-start" arrow>
                  <input
                    type="number"
                    min={0}
                    max={1000000}
                    className="form-control"
                    id="buyoutPrice"
                    onChange={handleFormChange}
                    value={formState.buyoutPrice}
                    name="buyoutPrice"
                    placeholder="20"
                  />
                  </Tooltip>
                  <label htmlFor="floatingInput">Buyout Price*</label>
                </div>
              </div>
            </div>
            <p className="text-mint bg-dark bg-opacity-50 px-2 py-1 rounded">* Fields are required</p>
            <button
              type="submit"
              className="btn btn-jet"
              data-mdb-ripple-color="dark"
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    </form>
    </LocalizationProvider>
  );
}

export default EditListingForm;
