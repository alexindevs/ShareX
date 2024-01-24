npm install -D typescript

npm install @types/node @types/express @types/body-parser @types/cors dotenv @types/bcrypt @types/jsonwebtoken @types/mongoose mongoose jsonwebtoken bcrypt joi express cors body-parser winston @types/winston uuid

echo '{
    "compilerOptions": {
      "target": "ES2020",
      "module": "commonjs",
      "outDir": "./dist",
      "strict": true,
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "skipLibCheck": true,
      "resolveJsonModule": true
    },
    "include": [
      "./src/**/**/*.ts",
      "./src/**/*.ts",
      "src/server.ts"
    ],
    "exclude": [
      "./dist"
    ]
}' > tsconfig.json

mkdir src
cd src

echo 'import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 7000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
' > server.ts

mkdir  utils models controllers services middlewares routes

# run multiple bash commands at once here