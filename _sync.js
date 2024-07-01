const fs = require("fs").promises;
const exists = require("fs").existsSync

const path = require("path");

const serverDirectory = "server";
const clientDirectory = "dist";
const destinationDirectory = "appsScript";


async function  syncFiles(sourceDir, destDir){
    console.log(`syncing files in ${sourceDir}`)
    try {
        const directory =  await fs.readdir( path.resolve(__dirname, sourceDir) )
        for (let item of directory){

            const sourcePath = path.join(sourceDir, item);
            const destPath = path.join(destDir, item);

            const stat = await fs.lstat(sourcePath)
            if ( stat.isFile() ) {

                await fs.copyFile(sourcePath, destPath);

            }else if ( stat.isDirectory() ){

                try {

                    await fs.readdir(destPath);

                }catch (e) {

                    await fs.mkdir(destPath);

                }

                await syncFiles(sourcePath, destPath)

            }
        }
    }catch( error ) {
        console.log(error)
    }
}

syncFiles(serverDirectory, destinationDirectory).then( () => console.log(`done syncing ${serverDirectory} files.`) )
syncFiles(clientDirectory, destinationDirectory).then( () => console.log(`done syncing ${clientDirectory} files.`))