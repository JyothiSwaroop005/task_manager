const options = [
  { value: 'All', label: 'All Tasks' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'High', label: 'High Priority' },
  { value: 'Medium', label: 'Medium Priority' },
  { value: 'Low', label: 'Low Priority' },
  { value: 'DueDate', label: 'Has Due Date' },
];

const FilterDropdown = ({ value, onChange }) => {
  return (
    <select className="dropdown" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;
