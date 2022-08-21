import React from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

const Home = () => {
  return (
    <div>
      <AppNavbar/>
      <div class="center">
      <Container fluid>
        <Button color="info" size="lg" tag={Link} to={"/expenses"}>Manage expenses</Button>
      </Container>
      </div>
    </div>
  );
}

export default Home;