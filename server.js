
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const Contenedor = require("./contenedor.js")
const contenedor = new Contenedor("productos.json");

//middlewares:
app.use(express.json());
app.use(express.urlencoded({extends:true}));// recibe cualquier tipo de dato

app.use(express.static(__dirname + "public"));

//view engine/motores de plantillas
app.use("/", "views");
app.use("/api/productos");
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.engine("handlebars", handlebars.engine());
app.set("view engine", "pug");
app.set ("view engine", "ejs");
//de donde debe sacar la info dinamica:
app.set("views", __dirname + "./views"); //directorio de trabajo

app.set("view engine","handlebars");

// const router = express.Router();
app.use("/api/productos", app);


//GET:
// /api/productos
app.get("/", async (req, res) => {
    const products = await contenedor.getAll();
    res.status(200).json(products)
})

///api/productos/:id
app.get("/:id", async (req, res) => {
    const {id} = req.params;
    const product = await contenedor.getById(id);

    product
        ? res.status(200).json(product)
        : res.status(404).json({error: "No se encontro el producto"});
    
})
// POST
///api/productos
app.post("/", async (req,res) => {
    const {body} = req;
    const newProductId = await contenedor.save(body);
    res.status(200).send(`Producto agregado con el ID: ${newProductId}`)
})
//PUT
// /api/productos/:id
app.put("/:id", async (req, res) => {
    res.render("index", {form: "formulario"});
    const {id} = req.params;
    const {body} = req;
    const wasUpdated = await contenedor.updateById(id,body);
    wasUpdated
        ? res.status(200).send(`El producto de ID: ${id} fue actualizado`)
        : res.status(404).send(`No se encontrĂ³ el producto con ID : ${id}`);
})
// DELETE
// /api/productos/:id
app.delete("/:id", async (req, res) => {
    const {id} = req.params;
    const wasDeleted = await contenedor.deleteById(id);
    wasDeleted 
        ? res.status(200).send(`El producto de ID: ${id} fue borrado`)
        : res.status(404).send(`No se encontrĂ³ el prodcutos con ID : ${id}`);
})



const server = app.listen(PORT, () => {
console.log(`Server on http://localhost:${PORT}`)
})

server.on("error", (err) => console.log(err));