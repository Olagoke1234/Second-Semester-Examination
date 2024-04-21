import React from "react";
import { Link } from "react-router-dom";

const AppendData = ({ data }) => {
  return (
    <tbody>
      {data.map((repo) => (
        <tr key={repo.id}>
          <td>{repo.id}</td>
          <td>{repo.name}</td>
          <td>
            {/* Use Link component to navigate to RepoDetailPage */}
            <Link to={`/repos/${repo.id}`}>{repo.html_url}</Link>
          </td>
          <td>{repo.language}</td>
        </tr>
      ))}
    </tbody>
  );
};

export default AppendData;
