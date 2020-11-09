import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

import "bootswatch/dist/lux/bootstrap.min.css";
import "./App.css";

const stripePromise = loadStripe("pk_test_51HldLzIs7ykcZv75Wzw2Dty25SSBZiyUrmjCgB6cyuzu05icseSjZ5cL1CVa3WPmsRfzSKRjCoEJkIoZPRHFkrhW00IfgFKzue");

const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        email: "chuckywestcoast1997@gmail.com",
        name: "Daniel Mendoza Verduzco",
      },
    });
    setLoading(true);

    if (!error) {
      const { id } = paymentMethod;

      try {
        const { data } = await axios.post("http://localhost:4000/api/checkout", {
          id, //id de transacción
          amount: 10000 //En centavos
        });

        console.log(data);

        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    } else {
      console.log(error);
    }
  }

  return <form onSubmit={handleSubmit} className="card card-body">
    <img src="https://team2soluciones.com/wp-content/uploads/2020/01/K552RGB-SP-0.png" alt="k68 keyboard" className="img-fluid" />
    <h3 className="text-center my-2">Price: 100$</h3>
    <div className="form-group">
      <CardElement className="form-control"/>
    </div>
    <button className="btn btn-success" disabled={!stripe}>
      {loading ? (
        <div className="spinner-border text-light" role="status">
          <span className="sr-only">Loading</span>
        </div>
      ) : (
        "Buy"
      )}
    </button>
  </form>;
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm/>
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
