import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Spinner from '../../../Spinner/Spinner'
import { resetIngredient } from '../../../../Redux/actionCreators'

const mapStateToProps = state => ({
  ingredients: state.ingredients,
  purchassble: state.purchassble,
  totalPrice: state.totalPrice,
  userId: state.userId,
  token: state.token
})

const mapDispatchToProps = dispatch => ({
  resetIngredient: () => dispatch(resetIngredient())
})

class Checkout extends Component {
  state = {
    delivaryAddress: '',
    phone: '',
    paymentType: 'Cash On Delivaray',
    isLoading: false,
    isModalOpen: false,
    Modalmsg: ''
  }

  handleInputChange = e => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({
      isLoading: true
    })
    // console.log(this.props); // console log
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      userId: this.props.userId,
      customer: this.state,
      orderTime: new Date()
    }
    // console.log(order);
    fetch('https://burger-builder-55d2b-default-rtdb.firebaseio.com/orders.json?auth=' + this.props.token, {
      method: 'POST',
      body: JSON.stringify(order)
    }).then(
      response => {
        if (response.status === 200) {
          this.setState({
            isLoading: false,
            isModalOpen: true,
            Modalmsg: 'Order place Successfully!'
          })
          this.props.resetIngredient();
        } else {
          this.setState({
            isLoading: false,
            isModalOpen: true,
            Modalmsg: 'Something Went Wrong! place try again'
          })
        }
      }
    )
      .catch(
        () => this.setState({
          isLoading: false,
          isModalOpen: true,
          Modalmsg: 'Something Went Wrong! place try again'
        })
      )
  }

  render() {
    // console.log(this.props); // console log
    const form = (<div>
      <h4 style={{
        border: "1px solid gray",
        boxShadow: '1px 1px #888',
        borderRadius: '5px',
        padding: '20px'
      }}
      >
        Payment: {this.props.totalPrice} BDT
      </h4>
      <form style={{
        border: "1px solid gray",
        boxShadow: '1px 1px #888',
        borderRadius: '5px',
        padding: '20px'
      }}>
        <input
          type="textarea"
          className='form-control'
          placeholder='your address'
          name='delivaryAddress'
          value={this.delivaryAddress}
          onChange={(e) => this.handleInputChange(e)}
        />
        <br />
        <input
          type="text"
          className='form-control'
          placeholder='your number'
          name='phone'
          value={this.phone}
          onChange={(e) => this.handleInputChange(e)}
        />
        <br />
        <select
          name='paymentType'
          value={this.paymentType}
          className='form-control'
          onChange={(e) => this.handleInputChange(e)}
        >
          <option value="Cash On Delivary">Cash On Delevary</option>
          <option value="bKas">bKash</option>
        </select>
        <br />
        <Button style={{ backgroundColor: "#d70f64" }}
          onClick={this.handleSubmit}
          disabled={!this.props.purchassble}
        >Place Order</Button>
        <Link to="/">
          <Button color='secondary'
            onClick={this.goBack} className="ml-3">Cancle</Button>
        </Link>
      </form>
    </div>)
    return (
      <div>
        {this.state.isLoading ? <Spinner /> : form}
        <Modal isOpen={this.state.isModalOpen} >
          <ModalBody>
            <p>{this.state.Modalmsg}</p>
          </ModalBody>
          <ModalFooter>
            <Link to="/">
              <Button color='primary'>Back to Home Page</Button>
            </Link>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)