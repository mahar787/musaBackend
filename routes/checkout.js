const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const mongoose = require("mongoose");
const { v4 } = require("uuid");
const uuidv4 = v4;
require("dotenv").config();
const Order = require("../models/order.model.js");
const OrderItem = require("../models/orderItem.model.js");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  const currencyUrl = `https://api.currencyapi.com/v3/latest?apikey=${process.env.CURRENCY_API_KEY}&base_currency=PKR&currencies=USD`;
  try {
    const data = req.body;
    console.log(data);
    console.log(data.data.cartItems[0]);
    const checkoutUuid = uuidv4();
    let ids = [];

    for (const item of data.data.cartItems) {
      let newOrderItem = new OrderItem({
        productId: new mongoose.Types.ObjectId(item.id),
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedColors: item.sizes,
        selectedSizes: item.colors,
      });

      let newSavedOrderItem = await newOrderItem.save(); // Await the save operation
      ids.push(newSavedOrderItem._id); // Now _id will be available
    }

    if (data.data.paymentMethod === "cash") {
      const newOrder = new Order({
        contact: data.data.contact,
        country: data.data.country,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        address: data.data.address,
        apartment: data.data.apartment,
        city: data.data.city,
        postalCode: data.data.postalCode,
        paymentMethod: data.data.paymentMethod,
        items: ids.map((id) => ({ orderItemId: id })),
        totalPrice: data.data.totalAmount,
      });
      let newSavedOrder = await newOrder.save();
      res.json({
        message: `Your Order Placed Successfully! and Your Order Id is ${newSavedOrder._id}`,
        cash: true,
      });
    } else {
      const newOrder = new Order({
        contact: data.data.contact,
        country: data.data.country,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        address: data.data.address,
        apartment: data.data.apartment,
        city: data.data.city,
        postalCode: data.data.postalCode,
        paymentMethod: data.data.paymentMethod,
        items: ids.map((id) => ({ orderItemId: id })),
        totalPrice: data.data.totalAmount,
      });
      let newSavedOrder = await newOrder.save();
      // Fetch PKR to USD conversion rate
      const response = await fetch(currencyUrl);
      const currencyData = await response.json();
      const conversionRate = currencyData.data.USD.value;
      // Convert delivery charges to USD

      const items = data.data.cartItems;
      //   Prepare line items for Stripe checkout
      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * conversionRate * 100), // Convert price to USD (cents)
        },
        quantity: item.quantity,
      }));

      //     // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/checkout/success?orderId=${newSavedOrder._id}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
        metadata: {
          order_id: checkoutUuid, // Attach UUID to the session metadata
        },
      });

      res.json({ id: session.id });
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

module.exports = router;
