import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Button, Breadcrumb, BreadcrumbItem,
  Modal, ModalHeader, ModalBody, Row, Col,
  Form, FormGroup, FormFeedback, Input, Label  } from 'reactstrap';
import { Link } from 'react-router-dom';
import {LocalForm, Control, Errors} from 'react-redux-form';
import { Loading } from './LoadingComponent';

  function RenderDish({dish}) {
    return(
      <div className="col-12 col-md-5 m-1">
          <Card>
              <CardImg top src={dish.image} alt={dish.name} />
              <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
              </CardBody>
          </Card>
      </div>
    );
  }

  function RenderComments({comments, addComment, dishId}) {
    if (comments == null){
      return <div />;
    }
    const cmnts = comments.map(comment => {
      return(


            <li key={comment.id}>
            <p>{comment.comment}</p>
            <p>-- {comment.author},
            &nbsp;
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit"
            }).format(new Date(Date.parse(comment.date)))}
            </p>

            </li>

          );
    });
      return(
        <div className="col-12 col-md-5 m-1">
        <h4>Comments</h4>
        <ul className="list-unstyled">
        {cmnts}
        </ul>
        <CommentForm dishId={dishId} addComment={addComment}/>
        </div>
      );

    }


  const  DishDetail = (props) => {
    if(props.isLoading){
      return(
          <div className="container">
            <div className="row">
            <Loading />
            </div>
          </div>
      );
    }

    else if(props.errMess){
      return(
          <div className="container">
            <div className="row">
            <h4>{props.errMess}</h4>
            </div>
          </div>
      );
    }

    else if (props.dish != null){
      return(
        <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>
            </div>
            <div className="row">
              <RenderDish dish={props.dish} />
              <RenderComments comments={props.comments} addComment={props.addComment} dishId={props.dish.id}/>

            </div>
          </div>
      );
    }
  else{
    return(
      <div></div>
      );
  }


}

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component{
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values) {
      this.toggleModal();
      this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
      // console.log('Current State is: ' + JSON.stringify(values));
      // alert('Current State is: ' + JSON.stringify(values));
      // event.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
      <div className="container">
      <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm className="container" onSubmit={(values) => this.handleSubmit(values)}>
              <Row className="form-group">
                <Label htmlFor="rating">Rating</Label>
                <Control.select className= "form-control" type="number" id="rating" name="rating" min="0" max="5"
                model=".rating" defaultValue={5}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  </Control.select>
              </Row>
              <Row className="form-group">
              <Label htmlFor="firstname">First Name</Label>

              <Control.text model=".author" id="author" name="author"
                      placeholder="Your Name"
                      className="form-control"
                      validators={{
                              required, minLength: minLength(3), maxLength: maxLength(15)
                          }} />
                      <Errors
                          className="text-danger"
                          model=".name"
                          show="touched"
                          messages={{
                              required: 'Required ',
                              minLength: 'Must be greater than 2 characters',
                              maxLength: 'Must be 15 characters or less'
                          }}
                       />
              </Row>
              <Row className="form-group">
                  <Label htmlFor="message">Comment</Label>

                      <Control.textarea model=".comment" id="comment" name="comment"
                          rows="6"
                          className="form-control" />

              </Row>
              <Row className="form-group">
              <Button type="submit" value="submit" color="primary">Submit</Button>
              </Row>
            </LocalForm>
          </ModalBody>

        </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default DishDetail;
