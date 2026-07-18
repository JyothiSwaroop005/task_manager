const getInitials = (name = '') =>
  name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

const Avatar = ({ name, size = 40 }) => {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
