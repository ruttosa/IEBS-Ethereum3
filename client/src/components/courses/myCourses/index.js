import React, { useEffect, useState } from "react"
import { Card, Container, Grid, Header } from "semantic-ui-react"


const MyCourses = ({contract, accounts}) => {
  const [myCourses, setMyCourses] = useState([]);

  const getMyCourses = async () => {
    const response = contract && await contract.methods.getAllMyCourses(accounts[0]).call();
    setMyCourses(response);
  }
  useEffect(() => {
    getMyCourses();
  }, []);

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as='h1'>MIS CURSOS</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
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
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default MyCourses;
