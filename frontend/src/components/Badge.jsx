const Badge = ({ children, variant = 'default' }) => {
  const variantClasses = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info'
  };

  return (
    <span className={`badge ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
