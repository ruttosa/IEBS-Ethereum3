import React from "react";
import { Button } from "semantic-ui-react";

const NotFound = () => {
  return ( 
    <div className="App-no-web3">
      <h2>404 - PAGE NOT FOUND 🧐</h2>
      <p>The page was not found.</p>
      <h3>Try again! ⏭️</h3>
      <Button primary onClick={async (e) => {await this.onLogIn(e)}}>CONECTARSE</Button>
    </div>
  );
};

export default NotFound;