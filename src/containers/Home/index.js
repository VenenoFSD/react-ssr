import React from 'react'
import Header from '../../components/Header'

const Home = () => (
  <div>
    <Header/>
    <h2>Home</h2>
    <button onClick={ () => { alert('hello') } }>Click</button>
  </div>
);

export default Home
