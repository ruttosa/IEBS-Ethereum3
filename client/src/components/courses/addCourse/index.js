import React, { useState } from "react";
import { Button, Card, Container, Grid, Header, Icon, Input } from "semantic-ui-react";
import { Editor } from "react-draft-wysiwyg";

const INITIAL_COURSE_OBJ = { title: 'TEST', description: '', price: 0, content: '', creationDate: 0};

const MyContent = ({contract, accounts}) => {
  const [newCourse, setNewCourse] = useState(INITIAL_COURSE_OBJ);

  const onInputChange = (e, input) => {
    e.preventDefault();
    setNewCourse({...newCourse, [input.id]: input.value})
  }

  const onEditorStateChange = (editorState) => {
    setNewCourse({...newCourse, content: editorState})
  };

  const createCourse = async () => {
    const response = await contract.methods.createCourseToken(accounts[0], newCourse).send({from: accounts[0]})
  }

  const onCreateCourseClick = (e) => {
    e.preventDefault();
    createCourse();
  };

  return (
    <Container style={{paddingTop: '25px'}}>
      <Card raised centered fluid>
        <Card.Header className="Card-Header">
          <Header as='h1'>REGISTRO DE CURSO</Header>
        </Card.Header>
        <Card.Content>
          <Container>
            <Grid columns={2} stretched>
              <Grid.Row>
                <Grid.Column>
                  <Input id='title' label='Título' fluid onChange={(e, input) => onInputChange(e, input)} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Input id='description' label='Descripción' fluid onChange={(e, input) => onInputChange(e, input)} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Input id='price' type="number" label='Precio' fluid onChange={(e, input) => onInputChange(e, input)} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
          <Container fluid className="m-top">
            <Header as='h4' content='Contenido del curso' icon={<Icon name='book'/>} />
            <Editor id='content' editorStyle={{border: '1px solid lightgray'}}
              editorState={newCourse && newCourse.content}
              onEditorStateChange={onEditorStateChange} />
          </Container>
          <Container className="m-top">
            <Button content='CREAR CURSO' primary onClick={(e) => onCreateCourseClick(e)} />
          </Container>
        </Card.Content>
      </Card>
    </Container>
  );
}
 
export default MyContent;