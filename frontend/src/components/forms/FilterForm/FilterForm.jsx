import React, { useState } from "react";
import years from "../../../years";
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import "./FilterForm.css"
function FilterForm(props) {
  const [formState, setFormState] = useState({ propertyType: "", location: "", minYear: 0, maxYear: 3000, minPrice: 0, maxPrice: 214748364, minSize: 0, maxSize: 4000 });

  const handleFormChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormState({ ...formState, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    props.applyFilters(formState);
  }

  return (
    <div className="accordion" id="filtersAccordion">
      <h2 className="accordion-header" id="headingOne">
        <button className="accordion-button background-main-alpha collapsed rounded-top" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilters" aria-expanded="false" aria-controls="collapseFilters">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-funnel-fill me-1" viewBox="0 0 16 16">
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" />
          </svg>
          <span className="fw-semibold">Filters</span>
        </button>
      </h2>
      <div id="collapseFilters" className="accordion-collapse collapse border border-2" aria-labelledby="headingOne" data-bs-parent="#filtersAccordion">
        <div className="accordion-body">
          <form onSubmit={handleSubmit}>
            <div className="row gx-5 align-items-center">
              <div className="col-md-5">
                <div className="row gx-3 mb-3">
                  <label htmlFor="inputYearMin" className="col-auto col-form-label">
                    Year: from
                  </label>
                  <div className="col-md-4 me-auto">
                    <select name="minYear" id="inputYearMin" onChange={handleFormChange} defaultValue={0} className="form-select" aria-label="Default select example">
                      {
                        years.map((number) => (
                          <option value={number} key={number}>{number}</option>
                        ))
                      };
                    </select>
                  </div>
                  <label htmlFor="inputYearMax" className="col-auto col-form-label">
                    To
                  </label>
                  <div className="col-md-4">
                    <select id="inputYearMax" onChange={handleFormChange} name="maxYear" defaultValue={0} className="form-select" aria-label="Default select example">
                      {
                        years.map((number) => (
                          <option value={number} key={number}>{number}</option>
                        ))
                      };
                    </select>
                  </div>
                </div>

                <div className="row gx-3 mb-3">
                  <label htmlFor="inputSizeMin" className="col-auto col-form-label">
                    Size: from
                  </label>
                  <div className="col-md-4 me-auto">
                    <input
                      type="number"
                      min={0}
                      max={2000}
                      onChange={handleFormChange}
                      className="form-control"
                      name="minSize"
                      id="inputSizeMin"
                      placeholder="50 m²"
                    />
                  </div>
                  <label htmlFor="inputSizeMax" className="col-auto col-form-label">
                    To
                  </label>
                  <div className="col-md-4">
                    <input
                      type="number"
                      min={0}
                      max={2000000}
                      onChange={handleFormChange}
                      name="maxSize"
                      className="form-control"
                      placeholder="100 m²"
                      id="inputSizeMax"
                    />
                  </div>
                </div>

                <div className="row gx-3 mb-3">
                  <label htmlFor="inputPriceMin" className="col-auto col-form-label">
                    Price: from
                  </label>
                  <div className="col-md-4 me-auto">
                    <input
                      type="number"
                      min={0}
                      max={2000000}
                      onChange={handleFormChange}
                      className="form-control"
                      name="minPrice"
                      id="inputPriceMin"
                      placeholder="€2000"
                    />
                  </div>
                  <label htmlFor="inputPriceMax" className="col-auto col-form-label">
                    To
                  </label>
                  <div className="col-md-4">
                    <input
                      type="number"
                      min={0}
                      max={2000000}
                      onChange={handleFormChange}
                      name="maxPrice"
                      className="form-control"
                      placeholder="€4000"
                      id="inputPriceMax"
                    />
                  </div>
                </div>

              
              </div>

              <div className="col-md-5">
                <div className="mb-3">
                  <label htmlFor="propertyType" className="form-label">
                    Property type
                  </label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="propertyType"
                    onChange={handleFormChange}
                    id="propertyType"
                    placeholder="Detached house, Apartment..."
                  />
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleFormChange}
                    id="location"
                    name="location"
                    placeholder="Eindhoven, Netherlands"
                  />
                </div>
              </div>

              <div className="col-md-2">
              <Tooltip title={<Typography fontSize={14}>Search</Typography>} placement="bottom">
                <button type="submit" className="btn btn-primary px-4"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg></button>
                </Tooltip>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  )
}

export default FilterForm;