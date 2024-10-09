function Header({ headerContent }) {
  return (
    <header style={{ zIndex: 1 }}>
      <h1>The Weather Report</h1>
      <h4>Hows The Weather?</h4>
      {headerContent}
    </header>
  );
}

export default Header;
