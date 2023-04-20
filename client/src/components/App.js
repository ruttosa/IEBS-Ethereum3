/* eslint-disable */

// Import React package
import React from "react";
import {Button, Card, Container, Grid, Header, Icon, Input} from 'semantic-ui-react';
import {Editor} from 'react-draft-wysiwyg';

// Import component CSS style
import "./App.css";
import 'semantic-ui-css/semantic.min.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Import helper functions
import getWeb3 from "../helpers/getWeb3";

//////////////////////////////////////////////////////////////////////////////////|
//        CONTRACT ADDRESS           &          CONTRACT ABI                      |
//////////////////////////////////////////////////////////////////////////////////|                                                             |
const CONTRACT_ADDRESS = require("../contracts/CourseBlock.json").networks[5777].address
const CONTRACT_ABI = require("../contracts/CourseBlock.json").abi;
const CONTRACT_NAME = require("../contracts/CourseBlock.json").contractName

export default class App extends React.Component {
  state = { web3Provider: null, accounts: null, networkId: null, contract: null, storageValue: null, myCourses: [],
    newCourse: { title: 'TEST', description: '', price: 0, content: '', creationDate: 0} };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the network ID
      const networkId = await web3.eth.net.getId();

      // Create the Smart Contract instance
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3Provider: web3, accounts: accounts, networkId: networkId, contract: contract });

      // Get the value from the contract to prove it worked and update storageValue state
      // this.getMethod
      this.getMyCourses()
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  registerAsCreator = async (e) => {
    const {contract, accounts} = this.state;
    const response = await contract.methods.grantMinterRole(accounts[0]).send({from: accounts[0]})
    console.log(response);
    alert("Te has registrado con éxito");
  }

  getMyCourses = async () => {
    const {contract, accounts} = this.state;
    const response = await contract.methods.getAllMyCourses(accounts[0]).call();
    this.setState({ myCourses: response});
  }

  onInputChange = (e, input) => {
    const {newCourse} = this.state;
    e.preventDefault();
    this.setState({...this.state, newCourse: {...newCourse, [input.id]: input.value}  })
    console.log(newCourse)
  }

  onEditorStateChange = (editorState) => {
    const {newCourse} = this.state;
    this.setState({...this.state, newCourse: {...newCourse, content: editorState}  })
  };

  createCourse = async (e) => {
    const {newCourse, contract, accounts} = this.state;
    e.preventDefault();
    const response = await contract.methods.createCourseToken(accounts[0], newCourse).send({from: accounts[0]})
    this.getMyCourses()
  }

  renderMyCourses = () => {
    const {myCourses} = this.state;
    return (        
      <Card fluid raised>
        <Card.Content>
          <Grid verticalAlign="middle" columns={4}>
            {myCourses.length > 0 ? 
              myCourses.map((course, i) => {
                return (
                <Grid.Row key={i}>
                  <Grid.Column>
                    <Header as='h5'>{course.title}</Header>
                  </Grid.Column>
                  <Grid.Column>
                    <Header as='h5'>{course.description}</Header>
                  </Grid.Column>
                  <Grid.Column>
                    <Header as='h5'>{course.price}</Header>
                  </Grid.Column>
                  <Grid.Column>
                    <Header as='h5'>{course.content}</Header>
                  </Grid.Column>
                </Grid.Row>
                )
              })
              : <Header as='h3'>Aún no tiene ningún curso registrado</Header>
            }
          </Grid>
        </Card.Content>
      </Card>
    );
  }

  render() {
    const { accounts, networkId, newCourse} = this.state;
    if (!this.state.web3Provider) {
      return <div className="App-no-web3">
        <h3>No Web3 connection... 🧐</h3>
        <p>Jump to the next chapter to configure the Web3 Provider.</p>
        <h3>Let's go! ⏭️</h3>
      </div>;
    }
    return (
      <div className="App-Layout">
        {/* this.renderDefaultApp() */}
        <Container fluid>
          <Container fluid className="Menu-Container">
            <Grid columns={3} verticalAlign="middle">
              <Grid.Row>
                <Grid.Column textAlign="left">Account: {accounts[0]}</Grid.Column>
                <Grid.Column textAlign="left">Network: {networkId}</Grid.Column>
                <Grid.Column textAlign="right">
                  <Button content='Registrarse' onClick={(e) => this.registerAsCreator(e)} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
          <Container>
            <Header as='h1'>MIS CURSOS</Header>
            {this.renderMyCourses()}
          </Container>
          <Container className="m-top">
            <Card raised fluid>
              <Card.Header className="Card-Header">
                <Header as='h1'>REGISTRO DE CURSO</Header>
              </Card.Header>
              <Card.Content>
                <Container>
                  <Grid columns={2} stretched>
                    <Grid.Row>
                      <Grid.Column>
                        <Input id='title' label='Título' fluid onChange={(e, input) => this.onInputChange(e, input)} />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <Input id='description' label='Descripción' fluid onChange={(e, input) => this.onInputChange(e, input)} />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <Input id='price' type="number" label='Precio' fluid onChange={(e, input) => this.onInputChange(e, input)} />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Container>
                <Container fluid className="m-top">
                  <Header as='h4' content='Contenido del curso' icon={<Icon name='book'/>} />
                  <Editor id='content' editorStyle={{border: '1px solid lightgray'}}
                    editorState={newCourse.content}
                    onEditorStateChange={this.onEditorStateChange} />
                </Container>
                <Container className="m-top">
                  <Button content='CREAR CURSO' primary onClick={(e) => this.createCourse(e)} />
                </Container>
              </Card.Content>
            </Card>
          </Container>
        </Container>
      </div>
    );
  }
}