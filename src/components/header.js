function Header({ headerContent }) {
  return (
    <header style={{ zIndex: 1 }}>
      <h1>Golf Website</h1>
      {headerContent}
    </header>
  );
}

export default Header;
