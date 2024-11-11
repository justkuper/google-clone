import Undici from "undici-types";
import Client = Undici.Client;
import {appwriteConfig} from "@/lib/appwrite/config";
import {Database} from "lucide-react";
import {Avatars, Databases, Storage} from "node-appwrite";

export const creationSessionClient = async (){
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId);

    const session =(await cookes()).get('appwrite-session')

    if(!session || !session.value) throw_new Error(message:'No session');

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Database(client);
        },
    };
};
export const createAdminClient = async ()=>{
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.secretKey);


    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage(){
            return new Storage(client);
        },
        get avatars(){
            return new Avatars(client);
        },
    };

}