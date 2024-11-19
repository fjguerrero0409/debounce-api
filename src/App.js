import React, { useState, useEffect, useCallback } from "react";

const App = () => {
  const [query, setQuery] = useState(""); // Texto ingresado por el usuario
  const [results, setResults] = useState([]); // Resultados de la API
  const [isLoading, setIsLoading] = useState(false); // Indicador de carga

  // Función para consumir la API
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
      // Filtrar usuarios por nombre que contenga el texto ingresado
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

  // Función de debounce
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Uso de debounce para controlar las llamadas a fetchUsers
  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 500), []);

  // Manejar cambios en el input
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
