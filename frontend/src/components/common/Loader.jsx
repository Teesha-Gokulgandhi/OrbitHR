const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const loader = (
    <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizes[size]}`} />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;