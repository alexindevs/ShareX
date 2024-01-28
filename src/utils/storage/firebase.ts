import admin from "firebase-admin";
import serviceAccount from "./.sharex-9a1cd-firebase-adminsdk-tzqbd-9e0a781986.json";


admin.initializeApp({
    credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
    storageBucket: process.env.BUCKET_URL
});
const storageBucket = admin.storage().bucket()
export default storageBucket;