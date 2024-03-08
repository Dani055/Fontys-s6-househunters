import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ListingCard from "../../components/ListingCard/ListingCard";
import FilterForm from "../../components/forms/FilterForm/FilterForm";
import PaginationLinks from "../../components/PaginationLinks/PaginationLinks";
import { getLiveListingsWithFiltersAndPage } from "../../service/listingService";

function MainPage() {
  
  const [listings, setListings] = useState(null);
  const [filters, setFilters] = useState({ bikeBrand: "", bikeModel: "", location: "", minYear: 0, maxYear: 3000, minPrice: 0, maxPrice: 214748364});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState(0);

  const applyFilters = (filterObj) => {
    setFilters(filterObj);
    setCurrentPage(0);
  }
  const changePage = (page) => {
    setCurrentPage(page);
  }
  const loadListingsWithFiltersAndPage = async () => {
    try {
      const res = await getLiveListingsWithFiltersAndPage(filters, currentPage);
      setResults(res.totalHist);
      setListings(res.listings);
      setTotalPages(res.totalPages);
    }
    catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later.")
    }
  }
  useEffect(() => {
    loadListingsWithFiltersAndPage();
  }, [filters, currentPage])

  useEffect(() => {
    loadListingsWithFiltersAndPage();
  }, [])
  return (
    <div>
      <div className="container my-4">
        <FilterForm applyFilters={applyFilters} />
      </div>
      <div className="container rounded mt-5">
        <div className="row mb-5 g-4 bg-light mx-1 px-2 pb-4">
          <div className="listings-top">
            <h3 className="m-0">Live/Pending listings</h3>
            <hr></hr>
            <p className="text-purple-light m-0">Found {results} listings...</p>
          </div>
          {listings?.map((listing) => {
            return <ListingCard key={listing._id} listing={listing}/>
          })}

        </div>

        <PaginationLinks changePage={changePage} totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

export default MainPage;
