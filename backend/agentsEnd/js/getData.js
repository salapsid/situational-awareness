
import { promises as fs } from 'fs';

/* The following function  reads data from a file filename. This is a async file*/
 const getData =  async(ntwrkDataFileNameWithPath)=>{
    try {
        const buffer=await fs.readFile(ntwrkDataFileNameWithPath);
        const ntwrkData=await JSON.parse(buffer)
        //console.log(ntwrkData)
        //console.info("File created successfully with Node.js v13 fs.promises!");
        return ntwrkData
    } catch (error){
        console.error(error);
    }

} 
export default getData