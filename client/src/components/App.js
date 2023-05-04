/* eslint-disable */

// Import React package
import React, { useEffect, useState } from "react";
import { createBrowserRouter, Router, RouterProvider, Routes, Route, Outlet, Link } from "react-router-dom";
import {Button, Card, Container, Grid, Header, Icon, Image, Input, Popup} from 'semantic-ui-react';
import {Editor} from 'react-draft-wysiwyg';

// Import component CSS style
import "./App.css";
import 'semantic-ui-css/semantic.min.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Import helper functions
import Web3 from "web3";

import NotFound from "./common/notFound";
import Dashboard from './dashboard'
import images from "../common/images";
import MyContent from "./courses/addCourse";
import MyCourses from "./courses/myCourses";

//////////////////////////////////////////////////////////////////////////////////|
//        CONTRACT ADDRESS           &          CONTRACT ABI                      |
//////////////////////////////////////////////////////////////////////////////////|                                                             |
const CONTRACT_ADDRESS = require("../contracts/CourseBlock.json").networks[80001].address
const CONTRACT_ABI = require("../contracts/CourseBlock.json").abi;
const CONTRACT_NAME = require("../contracts/CourseBlock.json").contractName

const App = () => {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [contract, setContract] = useState(null);
  
  const setWeb3Variables = async () => {
    // Create the Smart Contract instance
    const contract = new web3Provider.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    setContract(contract);

    // Use web3 to get the user's accounts.
    const accounts = await web3Provider.eth.getAccounts();
    // Get the network ID
    const networkId = await web3Provider.eth.net.getId();
    // Create the Smart Contract instance
    
    // example of interacting with the contract's methods.
    setAccounts(accounts);
    setNetworkId(networkId);
  }

  const getWeb3Provider = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      // Request account access if needed
      await window.ethereum.enable();
      // Accounts now exposed
      setWeb3Provider(web3);
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      // Use Mist/MetaMask's provider.
      const web3 = window.web3;
      console.log("Injected web3 detected.");
      setWeb3Provider(web3);
    }
    // Fallback to localhost; use dev console port by default...
    // Others
    else { alert('Please try with another modern browser or install the MetaMask plugin')}
}

  const cleanWeb3Provider = () => {
    setAccounts(null);
    setNetworkId(null);
    setContract(null);
  }

  useEffect(() => {   
    getWeb3Provider();
  }, []);

  useEffect(() => {   
    web3Provider && setWeb3Variables();
    !web3Provider && cleanWeb3Provider();
  }, [web3Provider]);

  const onLogIn = (e) => {
    e.preventDefault();
    getWeb3Provider();
  }

  const onLogOut = (e) => {
    e.preventDefault();
    setWeb3Provider(null);
  };

  
  const Layout = () => {
    return (<>
      <Container fluid className="menu-Container">
          <Grid verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={6} textAlign="left">
                <Grid columns={2} verticalAlign="middle">
                  <Grid.Row>
                    <Grid.Column width={4}>
                      <Link to={'/'}>
                        <Image src={`data:image/jpg;base64, ${images.find((x) => x.id == 'logo').data}`} size="tiny" />
                      </Link>
                    </Grid.Column>
                    <Grid.Column textAlign="left">
                      <Header as={'h1'} content={'W3B Academy'} color="yellow" />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column width={10} textAlign="right">
                {web3Provider ?
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={14}>
                        <Grid columns={3}>
                          <Grid.Row>
                            <Grid.Column>
                              <Link to={'/dashboard'}>
                                <Button fluid content={'Mis cursos'} />
                              </Link>
                            </Grid.Column>
                            <Grid.Column>
                              <Link to={'/content'}>
                                <Button fluid content={'Mi contenido'} />
                              </Link>
                            </Grid.Column>
                            <Grid.Column>
                              <Link to={'/marketplace'}>
                                <Button fluid content={'Marketplace'} />
                              </Link>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Grid.Column>
                      <Grid.Column width={2}>
                          <Popup position="bottom left" hoverable
                            trigger={<Icon name="user" size="large" link />}
                            content={
                              <Grid>
                                <Grid.Row>
                                  <Grid.Column>
                                    Account: {accounts && accounts[0]}
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                  <Grid.Column>
                                    Network: {networkId}
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                  <Grid.Column>
                                    <Button primary content={'Desconectarse'} icon={<Icon name="sign-out" link />}
                                      onClick={(e) => onLogOut(e)} />
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            } />
                        </Grid.Column>
                    </Grid.Row>
                  </Grid> : <Button content='Conectarse' onClick={(e) => onLogIn(e)} />
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Container fluid>
          <Outlet />
        </Container>
        <Container fluid>

        </Container>
      </>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>ERROR</div>,
      children: [
        {index:true, element: <div>Página Web</div>},
        {path: '/dashboard', element: <MyCourses contract={contract} accounts={accounts} />},
        {path: '/content', element: <MyContent contract={contract} accounts={accounts} />},
        {path: '/marketplace', element: <div>MARKETPLACE</div>}
      ]
    },
  ]);
    return (
      <RouterProvider router={router} />
    );
}

export default App;