import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()

const product = new ProductManager('database.json')

app.get('/products', async (req,res)=>{
    
    const limit = parseInt (req.query.limit)

    const products = await product.getProducts()

    if(limit){
        const limitProds = products.slice(0,limit)

        res.send(limitProds) 
    } else{
        res.send(products)
    }

    })

app.get('/products/:pid', async (req,res)=>{

    const products = await product.getProducts()
    
    const id = parseInt(req.params.id)

    const productFound = products.find(prod => prod.id === id)

    if (!productFound) res.send({ error: 'Product not found' })
    else res.send(productFound)
})

app.listen(8080, ()=>{
    console.log('The server is running, oh yeah!!')
})