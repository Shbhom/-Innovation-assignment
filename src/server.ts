import app from "./app";
import "dotenv/config"
import ConnectDB from "./utils/db.utils";

const port = process.env.PORT || 5500

app.listen(port, () => {
    ConnectDB()
    console.log(`Running App on port:${port}`)
})