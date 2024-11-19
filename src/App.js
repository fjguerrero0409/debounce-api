import React, { useState, useEffect, useCallback } from "react";

const App = () => {
  const [query, setQuery] = useState(""); 
  const [results, setResults] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 

  // Function to consume the API
  const fetchUsers = async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users`
      );
      const data = await response.json();
      //Filter users by name containing the entered text
      const filteredData = data.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // debounce function
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Using debounce to control calls to fetchUsers
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 500), []);

  // Handle changes in input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchUsers(value);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Buscador de Usuarios</h1>
      <input
        type="text"
        placeholder="Escribe el nombre del usuario..."
        value={query}
        onChange={handleInputChange}
        style={{
          padding: "10px",
          width: "300px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />
      {isLoading && <p>Cargando resultados...</p>}
      <ul>
        {results.map((user) => (
          <li key={user.id} style={{ marginBottom: "10px" }}>
            <strong>{user.name}</strong>
            <p>Email: {user.email}</p>
            <p>Teléfono: {user.phone}</p>
            <p>Empresa: {user.company.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
