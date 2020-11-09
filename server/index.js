const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();

const stripe = new Stripe("sk_test_51HldLzIs7ykcZv75gAoQOK6RHZGE1ImZEVqmDyM807DLPH5UoYlzAnDyv3jz8JRWzLEaV36549Ap5TV3Y7F73cXD00xJo6Hijo");

app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());

app.post("/api/checkout", async (req, res) => {
    try {
        const { id, amount } = req.body;

        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Gaming Keyboard",
            payment_method: id,
            confirm: true
        });

        console.log(payment);

        res.send({ message: "Successfull payment" });
    } catch (error) {
        console.log(error);
        res.json({ message: error.raw.message })
    }
});

app.listen(4000, () => {
    console.log("Server on port", 4000);
})