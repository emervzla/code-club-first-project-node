const express = require("express")
const uuid = require("uuid")

const port = 3000
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const {id} = request.params

    const index = orders.findIndex( order => order.id === id)

    if (index < 0) {
        return response.status(404).json({error: "Order not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkMethodUrl = (request, response, next) => {

    const url = request.url
    const method = request.method

    console.log(`The method used is: ${method}, and the url used is: ${url}`)

    next()
}

app.get("/order", checkMethodUrl, (request, response) => {
    return response.json(orders)

})

app.post("/order", checkMethodUrl, (request, response) => {
    const {orderClient, nameClient, priceOrder, status} = request.body
   
    const order = {id:uuid.v4(), orderClient, nameClient, priceOrder, status}
    
    orders.push(order)

    return response.status(201).json(order)
})

app.put("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {
    const {orderClient, nameClient, priceOrder, status} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {id, orderClient, nameClient, priceOrder, status} 

    orders[index] = updateOrder
    
    return response.json(updateOrder)
})

app.delete("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {
    const {orderClient, nameClient, priceOrder, status} = request.body
    const index = request.orderIndex
    const id = request.orderId

    return response.json(orders[index])
})

app.patch("/order/:id", checkOrderId, checkMethodUrl, (request, response) => {
    const {orderClient, nameClient, priceOrder, status} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {id, orderClient, nameClient, priceOrder, status}

    orders[index] = updateOrder
    
    return response.json(updateOrder)
})

app.listen(port, ()=> {
    console.log(`Server started on port ${port}`)
})