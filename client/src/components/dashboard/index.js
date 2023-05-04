import React from "react";
import MyCourses from "../courses/myCourses";

const Dashboard = () => {
  return ( 
    <div className="App-no-web3">
      <MyCourses myCourses={[]} />
    </div>
  );
};

export default Dashboard;