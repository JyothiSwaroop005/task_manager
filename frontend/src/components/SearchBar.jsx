import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <FiSearch />
      <input
        type="text"
        placeholder="Search by title or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
