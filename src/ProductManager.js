import fs from 'fs'

export default class ProductManager {
    constructor (path) {   
        this.path = path 
        this.format = 'utf-8'
        this.id = 0
    }

    getId =async () => {
        const products = await this.getProducts()
        const count = products.length
        const id = (count > 0) ? products[count - 1].id +1 :1 

        return id //Seria mejor retornar en linea anterior: return (count > 0) ? products[count - 1].id +1 :1
    }
    addProduct = async (title, description,price,thumbnail,stock,code) => {
        
        if(!title || !description || !price || !thumbnail || !stock || !code){
            console.log("Se deben completar todos los campos")
            return false
        }

        const codeProd = await this.getProducts() //Seria mejor const productos= await this.getProducts(), es decir nombrar mas explicitamente a las variables
        const invalidCode = codeProd.some((prod) => {return prod.code === code }) //Seria mejor   const invalidCode = codeProd.some(prod=> prod.code === code)
        if(invalidCode){
            console.error("El còdigo ingresado ya fue utilizado")
        }

        const product = {title, description, price, thumbnail, stock, code, id: await this.getId()}
        const list = await this.getProducts()
        list.push(product)

        await fs.promises.writeFile(this.path,JSON.stringify(list))
        //return o console.log "Registro creado correctamente" , esto seria muy buena practica y muy importante 
    }

    getProducts = async () => { 
        try {
            const date = await fs.promises.readFile(this.path, this.format)
            const dateObject = JSON.parse(date)
            return dateObject //Seria mejor return JSON.parse(date) sin agregarle el parseado en una variable, directamente retornar
        } catch (error) {
            console.error('No se encontro el archivo')
            return []
        }
        
    }
        
    getProductById = async (productId) => {

        const dateId = await this.getProducts()
        const findProduct = dateId.find((prod) => prod.id === productId);
        if(findProduct){
            return findProduct
        } else {
            console.error ("Not found")
        }


    }

    updateProduct = async (id,productObj) => {
        const upProd = await this.getProducts()
        const productIndex = upProd.findIndex((prod) => prod.id === id)
        if(!productIndex === -1){
            console.error('El producto no se actualizo')
            return; 
        }
        const updateProducts = upProd.map((product) =>{
            if(product.id===id){
                return {...product,...productObj}
    
            }
                return product
        })

        fs.promises.writeFile(this.path,JSON.stringify(updateProducts),'utf-8')
        //return o console.log "Registro actualizado correctamente" , esto seria muy buena practica y muy importante 
    }


    
    deleteProduct = async (productId) => {

        const delProd = await this.getProducts()
        const prodExist = delProd.findIndex((prod) => prod.id === productId)
        if(prodExist === -1){
            console.error('El producto no existe')
            return;
        }

        const deleteProduct = delProd.filter((prod) => prod.id !== productId)

        await fs.promises.writeFile(this.path, JSON.stringify(deleteProduct),'utf-8')
        //return o console.log "Registro eliminado correctamente" , esto seria muy buena practica y muy importante 
    }
}
