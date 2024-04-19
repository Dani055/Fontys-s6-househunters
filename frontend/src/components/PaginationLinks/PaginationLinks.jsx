import React from "react";
import "./PaginationLinks.css"
import { Link } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

function PaginationLinks(props) {
  return (
    <nav className="mb-5">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${props.currentPage <= 0 ? "disabled" : ""}`}>
          <Tooltip title={<Typography fontSize={14}>Back to beginning</Typography>} placement="top">
            <Link onClick={() => props.changePage(0)} className="page-link" to="#">
              <i className="fa-solid fa-angles-left"></i>
            </Link>
          </Tooltip>
          {/* first page */}
        </li>

        <li className={`page-item ${props.currentPage <= 0 ? "disabled" : ""}`}>
          <Tooltip title={<Typography fontSize={14}>Previous page</Typography>} placement="top">
            <Link onClick={() => props.changePage(props.currentPage + -1)} className="page-link" to="#" tabIndex="-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left mb-1" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
              </svg>
            </Link>
          </Tooltip>
          {/* previous page */}
        </li>

        {
          props.currentPage > 0 && <li className="page-item">
            <Link onClick={() => props.changePage(props.currentPage - 1)} className="page-link " to="#">
              {props.currentPage}
            </Link>
            {/* current page */}
          </li>
        }
        <li className="page-item active">
          <Link className="page-link" to="#">
            {props.currentPage + 1}
          </Link>
        </li>
        {
          props.currentPage + 2 <= props.totalPages && <li className="page-item">
            <Link onClick={() => props.changePage(props.currentPage + 1)} className="page-link" to="#">
              {props.currentPage + 2}
            </Link>
          </li>
        }
        <li className={`page-item ${props.currentPage + 2 > props.totalPages ? "disabled" : ""}`}>
          <Tooltip title={<Typography fontSize={14}>Next page</Typography>} placement="top">
            <Link onClick={() => props.changePage(props.currentPage + 1)} className="page-link" to="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right mb-1" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
              </svg>
            </Link>
            {/* next page */}
          </Tooltip>
        </li>
        <li className={`page-item ${props.currentPage + 2 > props.totalPages ? "disabled" : ""}`}>
          <Tooltip title={<Typography fontSize={14}>Jump to last</Typography>} placement="top">
          <Link onClick={() => props.changePage(props.totalPages - 1)} className="page-link" to="#">
            <i className="fa-solid fa-angles-right"></i>
            {/* last page */}
          </Link>
          </Tooltip>
        </li>

      </ul>
    </nav>
  );
}

export default PaginationLinks;
