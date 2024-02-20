import admin from "firebase-admin";
import serviceAccount from "./sharex-cred.json";


admin.initializeApp({
    credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
    storageBucket: process.env.BUCKET_URL
});
const storageBucket = admin.storage().bucket()
export default storageBucket;