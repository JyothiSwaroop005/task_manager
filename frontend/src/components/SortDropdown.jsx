const options = [
  { value: 'Latest', label: 'Latest' },
  { value: 'Oldest', label: 'Oldest' },
  { value: 'Alphabetical', label: 'Alphabetical' },
  { value: 'Priority', label: 'Priority' },
  { value: 'DueDate', label: 'Due Date' },
];

const SortDropdown = ({ value, onChange }) => {
  return (
    <select className="dropdown" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          Sort: {opt.label}
        </option>
      ))}
    </select>
  );
};

export default SortDropdown;
