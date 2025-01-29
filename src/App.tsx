import { Outlet } from 'react-router-dom';
import Nav from '../vite-project/src/components/Nav';
import React from 'react';

function App() {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
