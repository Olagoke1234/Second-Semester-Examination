import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";
import RepoDetailPage from "./RepoDetailPage.jsx";
import AppendData from "./appendData.jsx";
import "./App.css"; // Import CSS file for styling
import ErrorTestPage from "./ErrorTestPage.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import NotFoundPage from "./NotFoundPage.jsx"; // Import the NotFoundPage component

function App() {
  const [repoData, setRepoData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const reposPerPage = 10;

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const perPage = 100; // Set the number of repositories per page
        let page = 1;
        let allRepos = [];

        while (true) {
          const response = await fetch(
            `https://api.github.com/users/Olagoke1234/repos?page=${page}&per_page=${perPage}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch repositories");
          }

          const data = await response.json();
          if (data.length === 0) {
            // No more repositories available
            break;
          }

          allRepos = [...allRepos, ...data];
          page++;
        }

        setRepoData(allRepos);
      } catch (error) {
        console.error("Error fetching repositories:", error.message);
      }
    };

    fetchRepoData();
  }, []);

  // Filter repositories based on search query and language filter
  const filteredRepos = repoData.filter((repo) => {
    // Guard against null name values
    const repoName = repo.name ? repo.name.toLowerCase() : "";

    // Guard against null language values
    const repoLanguage = repo.language ? repo.language.toLowerCase() : "";

    // Check if the repository name includes the search query
    const nameMatches = repoName.includes(searchQuery.toLowerCase());

    // Check if the repository language includes the selected language filter
    const languageMatches =
      languageFilter === "" ||
      repoLanguage.includes(languageFilter.toLowerCase());

    // Return true if both name and language match the filter criteria
    return nameMatches && languageMatches;
  });

  // Calculate index of the first and last repo on the current page
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = filteredRepos.slice(indexOfFirstRepo, indexOfLastRepo);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  // Handle language filter change
  const handleLanguageFilterChange = (e) => {
    setLanguageFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when language filter changes
  };

  return (
    <Router>
      <div>
        <ErrorBoundary>
          {" "}
          <Routes>
            <Route
              path="/"
              element={
                <TablePage
                  currentRepos={currentRepos}
                  reposPerPage={reposPerPage}
                  totalRepos={filteredRepos.length}
                  paginate={paginate}
                  currentPage={currentPage}
                  handleSearchChange={handleSearchChange}
                  handleLanguageFilterChange={handleLanguageFilterChange}
                  searchQuery={searchQuery}
                  languageFilter={languageFilter}
                />
              }
            />
            <Route path="/repos/:repoId" element={<RepoDetailPage />} />
            <Route
              path="/error-test"
              element={
                <ErrorBoundary>
                  <ErrorTestPage />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

const TablePage = ({
  currentRepos,
  reposPerPage,
  totalRepos,
  paginate,
  currentPage,
  handleSearchChange,
  handleLanguageFilterChange,
  searchQuery,
  languageFilter,
}) => {
  return (
    <div>
      <h1>Github repositories List Olagoke1234</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={languageFilter} onChange={handleLanguageFilterChange}>
          <option value="">All Languages</option>
          <option value="JavaScript">JavaScript</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="SCSS">SCSS</option>
          {/* Add more options for other languages */}
        </select>
      </div>
      <table>
        <thead>
          <tr className="table-info">
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">URL</th>
            <th scope="col">Language</th>
          </tr>
        </thead>
        <AppendData data={currentRepos} />
      </table>
      <Pagination
        reposPerPage={reposPerPage}
        totalRepos={totalRepos}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ reposPerPage, totalRepos, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalRepos / reposPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="page-link"
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`page-link ${number === currentPage ? "active" : ""}`}
            >
              {number}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            onClick={() => paginate(currentPage + 1)}
            className="page-link"
            disabled={currentPage === Math.ceil(totalRepos / reposPerPage)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default App;
