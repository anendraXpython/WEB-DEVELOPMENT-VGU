import { useState } from "react";

function SearchBar({ onSearch, onClear }) {
  const [text, setText] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (text.trim() === "") {
      alert("please type a name to search");
      return;
    }
    onSearch(text);
  };

  const handleClear = () => {
    setText("");
    onClear();
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search by name"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear}>
        Clear
      </button>
    </form>
  );
}

export default SearchBar;
