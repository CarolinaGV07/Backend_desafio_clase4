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


    async function run () {
        const manager = new ProductManager('database.json')
        console.log(await manager.getProducts())
        await manager.addProduct("Producto prueba1", "Este es un producto de prueba1", 200, "Sin imagen1", 25 , "ABC123")
        await manager.addProduct("Producto prueba2", "Este es un producto de prueba2", 250, "Sin imagen2", 26 , "DEF234")
        await manager.addProduct("Producto prueba3", "Este es un producto de prueba3", 300, "Sin imagen3", 27 , "GHI345")
        await manager.addProduct("Producto prueba4", "Este es un producto de prueba4", 350, "Sin imagen4", 28 , "JKL456")
        await manager.addProduct("Producto prueba5", "Este es un producto de prueba5", 360, "Sin imagen5", 29 , "MNO789")
        await manager.addProduct("Producto prueba6", "Este es un producto de prueba6", 370, "Sin imagen6", 30 , "PQR582")
        await manager.addProduct("Producto prueba7", "Este es un producto de prueba7", 380, "Sin imagen7", 31 , "STU603")
        await manager.addProduct("Producto prueba8", "Este es un producto de prueba8", 390, "Sin imagen8", 32 , "VWX816")
        await manager.addProduct("Producto prueba9", "Este es un producto de prueba9", 400, "Sin imagen9", 33 , "YZA967")
        console.log(await manager.getProducts())
        console.log(await manager.getProductById(2))
        console.log(await manager.getProductById(5))
        console.log(await manager.updateProduct(2,{title:"Producto ya probado"}))
        console.log(await manager.getProducts())
        console.log(await manager.deleteProduct(4))
        console.log(await manager.getProducts())

    }

    run()